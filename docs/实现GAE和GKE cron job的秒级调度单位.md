# 实现GAE和GKE k8s cron job的秒级调度单位

### 问题

如何实现Google App Engine和Google Kubernetes Engine定时作业（`cron job`）的秒级调度（`schedule`）单位？

不同于`node-schedule`拥有秒级调度单位，可以将定时作业精确在某一秒执行。`GAE`和`GKE`的定时作业只能精确到分钟（`min`）。

在`GAE`的[定时作业](<https://cloud.google.com/appengine/docs/standard/nodejs/scheduling-jobs-with-cron-yaml#Node.js_cron_yaml_The_schedule_format>)文档中，`schedule`格式可以知道，时间单位的有效值包括：

- `minutes` 或 `mins`
- `hours`

在`GKE`的[定时作业](<https://cloud.google.com/kubernetes-engine/docs/how-to/cronjobs?hl=zh-cn#creating_a_cronjob>)文档中，CronJob 使用所需的 `schedule` 字段，该字段接受 Unix 标准 [`crontab`](https://en.wikipedia.org/wiki/Cron#Overview) 格式的时间。所有 CronJob 时间均采用世界协调时间 (UTC)：

- 第一个值表示分钟（0 到 59 之间）
- 第二个值表示小时（0 到 23 之间）
- 第三个值表示一个月中的某天（1 到 31 之间）
- 第四个值表示月份（1 到 12 之间）
- 第五个值表示星期（0 到 6 之间）

以及[k8s Cron Job](<https://kubernetes.io/zh/docs/concepts/workloads/controllers/cron-jobs/#%E8%B0%83%E5%BA%A6>)文档中的调度(schedule)都是Unix标准`crontab`格式的时间，`GKE`使用`kubernetes`，简称`k8s`，来管理`compute engine`集群（`kubernetes`集群）。

如前文所说，最小调度单位都是分钟，意味着定时作业的执行时刻，只能精确到分钟。

### 解决方案

#### `GAE` cron job

我们可以先尝试设置`GAE`定时作业的`schedule`为`every 1 seconds`，看看是什么效果。

`server.js`:

```js
const express = require('express');
const pkg = require('./package.json');
const app = express();

function validateCronRequest(req, res, next) {
  console.log('X-Appengine-Cron', req.get('X-Appengine-Cron'), typeof req.get('X-Appengine-Cron'));
  if (req.get('X-Appengine-Cron') !== 'true') {
    return res.status(403);
  }
  next();
}

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.get('/cronjob/sync', validateCronRequest, (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

```

`app.yaml`：

```yaml
runtime: nodejs8
service: cronjob-sec-unit
```

`cron.yaml`:

```yaml
cron:
  - description: 'sync job'
    url: /cronjob/sync
    schedule: every 1 seconds
    target: cronjob-sec-unit
```

首先部署`GAE` `service`:

```bash
gcloud app deploy
```

部署成功后，去`GCP` console - App Engine查看

![image](https://user-images.githubusercontent.com/17866683/55699647-4e325f00-59fe-11e9-9f35-6e35c519ccbe.png)

紧接着部署`GAE`定时作业:

```bash
gcloud app deploy ./cron.yaml
```

报错

> ERROR: (gcloud.app.deploy) An error occurred while parsing file: [/Users/ldu020/workspace/nodejs-gcp/src/app-engine/cron-jobs-second-unit-schedule/cron.yaml]
> Unable to assign value 'every 1 seconds' to attribute 'schedule':
> schedule 'every 1 seconds' failed to parse: line 1:8 mismatched input u'second' expecting set None
>   in "/Users/ldu020/workspace/nodejs-gcp/src/app-engine/cron-jobs-second-unit-schedule/cron.yaml", line 4, column 15

错误说“不能将`every 1 seconds`赋值给`schedule`，解析`every 1 seconds`失败”。可见，`GAE`定时作业`schedule`并不支持秒级单位。

修改`cron.yaml`，将`schedule`设置为`every 1 mins`：

```yaml
cron:
  - description: 'sync job'
    url: /cronjob/sync
    schedule: every 1 mins
    target: cronjob-sec-unit
```

再次部署，部署成功后查看`GCP`控制台:

![image](https://user-images.githubusercontent.com/17866683/55700223-03fead00-5a01-11e9-91c8-b0bdcaea0063.png)

查看该定时作业在`Stackdriver Logging`中的logs，验证该定时作业运行是否正常。

![image](https://user-images.githubusercontent.com/17866683/55702095-0f090b80-5a08-11e9-886f-95ff434d5ed6.png)

通过日志的时间戳可以看到，该定时作业每分钟执行一次。

查看`App Engine`部署的service的logs:

![image](https://user-images.githubusercontent.com/17866683/55702247-9787ac00-5a08-11e9-8b0f-d126804f400b.png)

该service运行正常，路由`/cronjob/sync`每分钟被定时作业调用一次。

接下来实现秒级调度单位的定时作业，本质上是将定时作业的最小调度单位——1分钟，再次划分成一系列秒级时间序列。对`Node.js`异步流程控制库[async](https://www.npmjs.com/package/async)熟悉的同学可以马上想到用`timeSeries`函数。我们这里将定时作业设置为10秒执行一次，修改后的代码如下：

`server.js`:

```js
const express = require('express');
const async = require('async');

const pkg = require('./package.json');
const app = express();

const OUTER_SCHEDULE = 60; // 1 minute
const INNER_SCHEDULE = 10; // 10 seconds

function validateCronRequest(req, res, next) {
  // console.log('X-Appengine-Cron', req.get('X-Appengine-Cron'), typeof req.get('X-Appengine-Cron'));
  if (process.env.NODE_ENV === 'production') {
    if (req.get('X-Appengine-Cron') !== 'true') {
      return res.status(403);
    }
  }

  next();
}

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.get('/cronjob/sync', validateCronRequest, async (req, res) => {
  // Update database every 1 minute
  // await updateDB();

  // Update database every 10 seconds
  try {
    await updateDBTimeSeries();
  } catch (error) {
    console.error(error);
  }
  res.sendStatus(200);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateDB() {
  return new Promise((resolve) => {
    process.nextTick(() => {
      console.log('Update database success.');
      resolve();
    });
  });
}

async function updateDBEveryTenSeconds(item, n, next) {
  // console.log('item: ', item);
  await updateDB();
  if (item < n - 1) {
    await sleep(INNER_SCHEDULE * 1000);
  }
  next();
}

async function updateDBTimeSeries() {
  const n = OUTER_SCHEDULE / INNER_SCHEDULE;
  return new Promise((resolve, reject) => {
    async.timesSeries(
      n,
      (item, next) => updateDBEveryTenSeconds(item, n, next),
      (error, results) => {
        if (error) {
          return reject(error);
        }
        console.log('A round update database operations done.');
        resolve(results);
      }
    );
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

```

部署后，查看`App Engine` service的日志：

![image](https://user-images.githubusercontent.com/17866683/55716428-88652600-5a29-11e9-918e-c771092f97f9.png)

可以看到，我们的调度任务每10秒执行一次，通过`async.timeSeries`方法将`GAE`定时作业的`schedule`（1分钟），划分出了6段。

#### GKE cron job

同理，我们也可以在`GKE`的定时作业上实现秒级调度单位。

`src/index.js`:

```js
const async = require('async');

const OUTER_SCHEDULE = 60;
const INNER_SCHEDULE = 10;

async function main() {
  try {
    await updateDBTimeSeries();
    console.log('A round update database operations done.');
  } catch (error) {
    console.error(error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateDB() {
  return new Promise((resolve) => {
    process.nextTick(() => {
      console.log('Update database success.');
      resolve();
    });
  });
}

async function updateDBEveryTenSeconds(item, n, next) {
  await updateDB();
  if (item < n - 1) {
    await sleep(INNER_SCHEDULE * 1000);
  }
  next();
}

async function updateDBTimeSeries() {
  const n = OUTER_SCHEDULE / INNER_SCHEDULE;
  return new Promise((resolve, reject) => {
    async.timesSeries(
      n,
      (item, next) => updateDBEveryTenSeconds(item, n, next),
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}

main();

```

示例代码和`GAE`例子的代码差不多，去掉了`express`启动的`HTTP` server的代码。

`k8s/cronjobs/update-db.yaml`:

```yam
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: update-db
spec:
  schedule: '*/1 * * * *'
  startingDeadlineSeconds: 10
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 1
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            run: update-db
        spec:
          restartPolicy: Never
          containers:
            - name: cron-job-second-unit-schedule
              image: asia.gcr.io/shadowsocks-218808/cron-job-second-unit-schedule:1.1
              env:
                - name: NODE_ENV
                  value: 'production'
                - name: K8S_POD_NAME
                  valueFrom:
                    fieldRef:
                      fieldPath: metadata.name
              ports:
                - containerPort: 8080
                  protocol: TCP

```

设置`schedule`为`*/1 * * * *`，表示每分钟执行一次作业，具体执行什么作业？执行容器`CMD`指令指定的启动脚本，即`npm start`，即`node ./src/index.js`。

`Dockerfile`:

```dockerfile
FROM node:8.9-alpine

WORKDIR /app
COPY ./ /app/

RUN apk update \
  && apk add curl --no-cache \
  && npm i -g npm@latest \
  && npm i --production

CMD [ "npm", "start" ]
```

`package.json`:

```json
"scripts": {
    "start": "node ./src/index.js"
},
```

下面关于打包`docker` `image`，还有`GKE`的使用和`k8s cron job`的部署简单说下。

打包`docker` `image`:

```bash
docker build -t cron-job-second-unit-schedule:1.1 .
```

设置`docker ` `tag`

```bash
docker tag cron-job-second-unit-schedule:1.1 asia.gcr.io/shadowsocks-218808/cron-job-second-unit-schedule:1.1
```

`push`该`docker` `image`到`GCR` registry:

```bash
docker push asia.gcr.io/shadowsocks-218808/cron-job-second-unit-schedule:1.1
The push refers to repository [asia.gcr.io/shadowsocks-218808/cron-job-second-unit-schedule]
2a9069409556: Pushed
4a18dd75bba0: Pushed
fbe45ea1c2a6: Layer already exists
f846841ed47f: Layer already exists
0198944a9875: Layer already exists
9dfa40a0da3b: Layer already exists
1.1: digest: sha256:81e4b2b5ddda93781bf368372d8697cad5619ca7ffa763cdd1eb0a49893622d1 size: 1577
```



使用`gcloud`命令行工具创建`kubernetes cluster`:

```bash
☁  cron-job-second-unit-schedule [master] ⚡  gcloud container clusters create nodejs-gcp --num-nodes=3

Creating cluster nodejs-gcp in us-west1-a... Cluster is being health-checked (master is healthy)...done.
Created [https://container.googleapis.com/v1/projects/shadowsocks-218808/zones/us-west1-a/clusters/nodejs-gcp].
To inspect the contents of your cluster, go to: https://console.cloud.google.com/kubernetes/workload_/gcloud/us-west1-a/nodejs-gcp?project=shadowsocks-218808
kubeconfig entry generated for nodejs-gcp.
NAME        LOCATION    MASTER_VERSION  MASTER_IP      MACHINE_TYPE   NODE_VERSION   NUM_NODES  STATUS
nodejs-gcp  us-west1-a  1.11.7-gke.12   35.199.144.38  n1-standard-1  1.11.7-gke.12  3          RUNNING
```

为`kubectl`命令设置默认集群，将`kubectl`的`context`设置为新创建的这个`cluster`

```bash
☁  cron-job-second-unit-schedule [master] ⚡  gcloud container clusters get-credentials nodejs-gcp
Fetching cluster endpoint and auth data.
kubeconfig entry generated for nodejs-gcp.
```

部署`k8s` cron job:

```bash
☁  cron-job-second-unit-schedule [master] ⚡  kaf ./k8s/cronjobs/update-db.yaml
cronjob.batch "update-db" created
```

部署完成后，去`GCP`控制台查看：

![image](https://user-images.githubusercontent.com/17866683/55727226-1fd77280-5a44-11e9-8bf5-16f480dc9205.png)

查看`update-db`定时作业的`container logs`:

![image](https://user-images.githubusercontent.com/17866683/55727288-3f6e9b00-5a44-11e9-9cd0-759a4e6d56f7.png)

![image](https://user-images.githubusercontent.com/17866683/55726041-7e4f2180-5a41-11e9-91c9-0297bd8c2550.png)

可以看到该定时作业每10秒执行一次。



