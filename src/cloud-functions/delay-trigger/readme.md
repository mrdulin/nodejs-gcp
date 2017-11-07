# GCP 任务队列

## 前言

这篇文章介绍了最简化的架构图，流程以及代码，只说重点，最重要的是理解架构设计，而不是代码细节，比如不要问我示例代码的环境变量为什么是 hard code 这种问题。生产环境还有很多东西需要处理，也有很多场景，不同的场景也会衍生出不同的问题，所以架构设计要根据具体的业务场景去调整。这里只介绍一种场景，算是抛砖引玉。阅读此文章需要熟悉实现任务队列用到的技术栈：

- App engine
- Cloud function
- Cloud Pub/Sub
- Node.js

以及异步编程的一些概念，例如`promise`，`async/await`等。

## 问题

当有大量并发任务时，由于接口的 rate limit 限制，导致任务失败，如何处理失败的任务?

## 解决方案

示例使用任务队列，将并发任务中失败的任务加入任务队列，每隔一段时间从任务队列中拉取任务进行重试操作，从而保证所有的并发任务最终都是成功的。（解决方案很多，根据业务需求来，这里只是演示一种方案）

## 架构图

![image](https://user-images.githubusercontent.com/17866683/54335693-bc387000-4664-11e9-95dd-e9ae09f3895c.png)

## 实施

一、创建和部署 Rate Limit App

使用`express-rate-limit`中间件来给接口增加 Rate Limit 功能，配置如下：

```js
const createUserLimiter = new rateLimit({
  windowMs: 30 * 1000,
  max: 2,
  message: 'Too many users created from this IP, please try again after 30 seconds'
});
```

`create user`的`API`如下：

```js
app.post('/create-user', createUserLimiter, (req, res) => {
  const user = req.body;
  memoryDB.users.push(user);
  res.end('create user success.');
});
```

每个 IP 地址在 30 秒的窗口时间内只能访问`/create-user` `API`两次，超过两次后，`createUserLimiter`中间件抛出异常，并提示`'Too many users created from this IP, please try again after 30 seconds'`的错误信息。

为了简便起见，这里使用内存对象模拟数据库：

```js
const memoryDB = { users: [] };
```

接口`/users`用来查看当前内存对象数据库中的所有 user 和总数：

```js
app.get('/users', (req, res) => {
  res.json({
    users: memoryDB.users,
    count: memoryDB.users.length
  });
});
```

创建`app.yaml`，用来部署到我们创建的服务到`GAE`(`google app engine`)上，如下：

```yaml
service: third-party-service
runtime: nodejs8
```

配置好`gcloud`命令行工具，开始部署，执行：

```bash
gcloud app deploy
```

部署成功后，查看`GCP` `console`:

![image](https://user-images.githubusercontent.com/17866683/54338266-5fd94e80-466c-11e9-8607-0f0ecfce4c86.png)

访问`https://third-party-service-dot-<YOUR_PROJECT_ID>.appspot.com/users`，可以看到：

![image](https://user-images.githubusercontent.com/17866683/54336663-a1b3c600-4667-11e9-97bf-fd528270291b.png)

当前内存数据库中没有 user。

二、创建和部署`createUser` `cloud function`

`cloud function`代码如下：

```js
const request = require('request-promise');

const pubsub = require('../pubsub');
const { config, MESSAGE_PROCESS_TOPIC } = require('../config');

const UserService = {
  CREATE_USER_RATE_LIMIT_ERROR: 'Too many users created from this IP, please try again after 30 seconds',

  createUser(user) {
    const url = `https://third-party-service-dot-${config.PROJECT_ID}.appspot.com/create-user`;
    const options = { method: 'POST', url, body: user, json: true };
    return request(options).catch((error) => {
      return Promise.reject(error.message);
    });
  }
};

const createUser = (event, callback) => {
  const pubsubMessage = event.data;
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message: ', message);

  UserService.createUser(message)
    .then(() => {
      console.log('create user successfully.');
    })
    .catch((error) => {
      console.log('create user failed.');
      if (error.indexOf(UserService.CREATE_USER_RATE_LIMIT_ERROR) !== -1) {
        console.log('Add create user task to task queue.');
        return pubsub.publish(MESSAGE_PROCESS_TOPIC, message).catch((error) => {
          // TODO: store user to Datastore
          return Promise.reject(error);
        });
      }
    })
    .then(() => callback())
    .catch(callback);
};

module.exports = createUser;
```

创建一个`UserService`以及一个`createUser`方法，用来向 Rate Limit App 发送`create user`请求。`cloud function`是后台函数，通过`Cloud Pub/Sub`来触发，运行时（runtime）是`nodejs6`（`nodejs6`和`nodejs8`的函数签名不一样，详见官方文档）。可以从`event`参数获取触发`cloud function`的消息，也就是通过`Cloud Pub/Sub`发布到`Topic`中的消息。调用`callback`表示`Cloud function`执行完成，回收资源。

在`Cloud Function`中调用`UserService.createUser`发起创建用户的请求，成功时，打印`create user successfully`日志到`stackdriver logs`；失败时，判断`error`是否是`CREATE_USER_RATE_LIMIT_ERROR`，如果是，将此次`create user`的`task`重新加入到名为`MESSAGE_PROCESS_TOPIC`的任务队列中。

部署`Cloud Function`之前，需要先创建触发该`Cloud Function`的`Pub/Sub` `Topic`，可以手动去`GCP` `console`创建，也可以通过应用程序创建。创建好的`Topic`如下：

![image](https://user-images.githubusercontent.com/17866683/54338361-a0d16300-466c-11e9-9039-0456b9ca0aea.png)

我们要用到`create-user`和`message-process`这两个`Topic`及其`Subscription`，`create-user`是用来触发上面的后台函数`createUser`的消息队列，`messsage-process`作为我们的任务队列(`Task Queue`)，我们将失败的`create user`任务加入到该`Task Queue`中，定时去该`Task Queue`中拉取`create user`任务，然后重新将该任务发布到`create-user`消息队列中。

创建一个部署脚本`deploy-createUser.sh`用来部署`createUser` `Cloud Function`：

```sh
functionName=createUser
topicName=create-user

gcloud beta functions deploy ${functionName} --trigger-resource ${topicName} --trigger-event google.pubsub.topic.publish
```

在`GCP` `console`查看部署好的`createUser` `Cloud Function`:

![image](https://user-images.githubusercontent.com/17866683/54338782-d3c82680-466d-11e9-98a3-a941607fb77e.png)

三、创建和部署`app engine` cron job service 和 cron job handler

首先，创建 cron job 处理服务

`server.js`:

```js
const express = require('express');
const async = require('async');

const package = require('./package.json');
const UserService = require('./userService');

const app = express();
const PORT = process.env.PORT || 8080;
const userService = new UserService();
const SCHEDULE = 60;
const n = SCHEDULE / process.env.CREATE_USER_SCHEDULER || 2;
console.log('n: ', n);

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.get('/tasks/create-user', async (req, res) => {
  async.timesSeries(
    n,
    (_, next) => userService.createUserTimeSeries(next),
    () => {
      res.sendStatus(200);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
```

`/tasks/create-user`就是每隔 1 分钟执行一次的定时任务触发的端点(`endpoint`)，换句话说，就是每 1 分钟调用一次`/tasks/create-user`，我们就可以在这里注册和实现我们的定时任务具体的功能逻辑了。关于这里为什么用`async.timesSeries`，简单说下，`app engine`在`cron.yaml`中定义的`cron job`, `schedule`最小是`every 1 mins`，要想实现精确到 second 的`schedule`，或者说，更细粒度的`schedule`，需要在代码中实现。使用`async.timesSeries`就可以实现`schedule`是`every 30 seconds`(`n = 2`)。

下面来看最重要的部分`userService.js`:

```js
const pubsub = require('./pubsub');
const { config } = require('./config');

function UserService() {
  const maxMessages = 1;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function createUser() {
    console.log('create user task start.');

    return pubsub
      .pull(config.PUBSUB.MESSAGE_PROCESS_SUBSCRIPTION, maxMessages)
      .then((messages) => {
        const message = messages[0];
        if (message) {
          return message;
        }
        return Promise.reject('No create user message found.');
      })
      .then((message) => {
        return pubsub.publish(config.PUBSUB.CREATE_USER_TOPIC, message.data, message.attributes).then(() => message);
      })
      .then((message) => {
        const projectId = config.PROJECT_ID;
        if (!projectId) {
          return Promise.reject('projectId is required');
        }
        const request = {
          subscription: `projects/${projectId}/subscriptions/${config.PUBSUB.MESSAGE_PROCESS_SUBSCRIPTION}`,
          ackIds: [message.ackId]
        };

        return pubsub.subscriberClient
          .acknowledge(request)
          .then(() => {
            console.log('create user message acked.');
          })
          .catch((error) => {
            console.error(`subscribeClient acknowledge message error.`);
            return Promise.reject(error);
          });
      })
      .then(() => {
        console.log('create user task done.');
      })
      .catch(console.log);
  }

  async function createUserTimeSeries(callback) {
    await createUser();
    await sleep(config.CREATE_USER_SCHEDULER);
    callback();
  }

  return {
    createUser,
    createUserTimeSeries
  };
}

module.exports = UserService;
```

`createUser`方法实现了从`message-process`任务队列中拉取`create user`任务，并将该任务发布到`create-user`消息队列中，`createUser` `Cloud Function`会消费`create-user`消息队列中的消息。

`createUserTimeSeries`方法配合`async.timesSeries`方法，实现每隔 30 秒去`message-process`任务队列中拉取`create user`任务的功能。

`cron job` handler 服务部署文件`app.yaml`:

```yaml
runtime: nodejs8
service: delay-trigger
env_variables:
  CREATE_USER_SCHEDULER: 30
```

`cron job`服务部署文件`cron.yaml`:

```yaml
cron:
  - description: 'create user scheduler'
    url: /tasks/create-user
    schedule: every 1 mins
    target: delay-trigger
```

部署成功后，在`GCP` `console`查看:

![image](https://user-images.githubusercontent.com/17866683/54340071-8352c800-4671-11e9-9b1e-f4fc11d71166.png)

![image](https://user-images.githubusercontent.com/17866683/54340138-a8473b00-4671-11e9-9c66-8efc847b7f3e.png)

在`stackdriver logs`查看`cron job`的运行情况:

![image](https://user-images.githubusercontent.com/17866683/54340193-d593e900-4671-11e9-9cf6-93a0c323225e.png)

每 1 分钟触发一次`/tasks/create-user`端点，每 30 秒去`message-process`任务队列中拉取`create user`任务，运行正常。

四、创建客户端

下面我们需要一个客户端模拟并发`create user`。

`createUser.js`:

```js
const faker = require('faker');

const pubsub = require('./pubsub');

async function main() {
  const count = 10;
  const CREATE_USER_TOPIC = 'create-user';

  for (let i = 0; i < count; i++) {
    const user = { id: faker.random.uuid(), name: faker.name.findName(), email: faker.internet.email() };
    pubsub.publish(CREATE_USER_TOPIC, user);
  }
}

main();
```

并发数为 10 ，执行：

```bash
☁  client [master] ⚡  node createUser.js
Message was published with ID: 421302379400827
Message was published with ID: 421302379400828
Message was published with ID: 421302379400829
Message was published with ID: 421302379400830
Message was published with ID: 421302379400831
Message was published with ID: 421302379400832
Message was published with ID: 421302379400833
Message was published with ID: 421302379400834
Message was published with ID: 421302379400835
Message was published with ID: 421302379400836
```

访问`https://third-party-service-dot-<YOUR_PROJECT_ID>.appspot.com/users`查看内存对象数据库中的 user:

![image](https://user-images.githubusercontent.com/17866683/54340657-d24d2d00-4672-11e9-9b95-bd017ace7f0f.png)

只有两个`create user`的任务是成功的，其他的都遇到了 Rate Limit 错误，查看`createUser` `Cloud Function`的日志:

![image](https://user-images.githubusercontent.com/17866683/54340795-1a6c4f80-4673-11e9-8b14-b88e9b9c7010.png)

可以看到部分用户创建失败，将创建用户失败的任务重新放回任务队列。现在整个系统已经在运行，等待几分钟，再次访问`https://third-party-service-dot-<YOUR_PROJECT_ID>.appspot.com/users`查看`memory` `DB`中的`user`：

![image](https://user-images.githubusercontent.com/17866683/54336547-513c6880-4667-11e9-9a31-855e04b1bb5f.png)

尽管有 Rate limit 的限制，但最终成功创建了 10 个`user`。

## 源码地址

https://github.com/mrdulin/nodejs-gcp/tree/master/src/cloud-functions/delay-trigger
