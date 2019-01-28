# GKE cluster 中的定时任务解决方案（一）

## 前言

当容器化应用程序部署到`GKE` cluster 中，部署模型是多 node，多 pod，多 docker container 的，应用程序在 docker container 中运行，因此应用程序也是多实例的。现在我们要做一个定时任务（cron job）的需求，该定时任务在每天凌晨 2 点触发，根据业务需求查询数据库，发送邮件，简单说，就是日报（daily report）。这篇文章不会去介绍`GKE`和`kubernetes`的概念，阅读此文章需要读者熟悉`GKE`,`GCE`,`kubernetes`,`docker`，集群，容器化等概念。

## 问题

在应用程序开发的最初阶段，应用程序在开发者的个人电脑上运行，只有一个实例（instance），`Node.js`运行环境即单个进程（process），单个线程（thread）。我们可能会使用[node-schedule](https://github.com/node-schedule/node-schedule)这个模块来实现定时任务，然后快速实现业务逻辑。示例代码：

```js
function dailyReport() {
  console.log('Setup daily report schedule');
  const jobName = 'daily-report';
  schedule.scheduleJob(jobName, config.DAILY_REPORT_SCHEDULE, () => {
    console.log('Start daily report');
    sendEmail();
  });
}
```

启动应用程序，日志如下：

```bash
☁  issue [master] ⚡  npm start

> issue@1.0.0 start /Users/ldu020/workspace/nodejs-gcp/src/kubernetes-engine/cron-job/issue
> node ./src/main.js

Setup daily report schedule
Server listening on http://localhost:8080
Start daily report
send email
```

定时任务运行正常，逻辑没问题。

但是当部署到`GKE` cluster 上，我们来看看是什么样的结果。

`GKE` cluster

![GKE cluster](https://ws4.sinaimg.cn/large/006tNc79ly1fzitl5vvgvj30rd08b756.jpg)

`GKE` cluster 中的节点（node），一个主节点（master node），两个从节点（slave node），`kubernetes`节点（node）的概念[详细说明](https://kubernetes.io/zh/docs/concepts/architecture/nodes/)

![GKE cluster nodes](https://ws4.sinaimg.cn/large/006tNc79ly1fzitmukjdqj310r0a4q4a.jpg)

`GKE`工作负载

![GKE工作负载](https://ws2.sinaimg.cn/large/006tNc79ly1fzitp222ymj30n008gq3o.jpg)

我已经将应用程序水平扩展到了 3 个副本（replicas），3 个 pod，每个 pod 中有一个`docker` `container`，应用程序运行在` docker``container `中，部署详情如下图：

![部署详情](https://ws2.sinaimg.cn/large/006tNc79ly1fzitzhw974j31h70oyn15.jpg)

进入第一个托管 pod（名称为 gke-cron-job-issue-69bc5b645f-t4g27），pod 详情如下：

![pod详情](https://ws4.sinaimg.cn/large/006tNc79ly1fziuc11g49j31h90oqaeh.jpg)

可以看到容器`gke-cron-job-issue`正在运行。

接下来验证使用`node-schedule`实现的定时任务出现的问题。

查看 pods

```bash
☁  issue [master] ⚡  kubectl get pods
NAME                                  READY     STATUS    RESTARTS   AGE
gke-cron-job-issue-69bc5b645f-hdd4z   1/1       Running   0          4h
gke-cron-job-issue-69bc5b645f-t4g27   1/1       Running   0          4h
gke-cron-job-issue-69bc5b645f-trsrx   1/1       Running   0          4h
```

查看各个 pod 中的 docker container 中应用程序打印出来的日志，开启 3 个终端会话窗口，分别执行：

```bash
kubectl logs -f <pod name> -c <container name>
```

我将定时任务的时间设置为`*/1 * * * *`，每分钟执行一次，3 个 pod 中的 docker container 中应用程序日志如下图（观察 2 分钟）：

![GKE container logs](https://ws2.sinaimg.cn/large/006tNc79ly1fziw82xnpmg31go0fkgm4.gif)

**可以看到每个应用程序实例都在执行该定时任务**，也就是说，接收日报（daily report）的邮箱每天会收到 3 封邮件，这不是我们想要的。

此问题源码地址：[GKE cron job issue source code](https://github.com/mrdulin/nodejs-gcp/tree/master/src/kubernetes-engine/cron-job/issue)

## 解决方案

我们期望的结果是同一时间只有一个应用程序实例执行该定时任务，接收日报（daily report）的邮箱每天只应该收到一封邮件。

使用[cloud scheduler](https://cloud.google.com/scheduler/), [cloud pub/sub](https://cloud.google.com/pubsub/docs/overview)解决该问题，在我部署到`GKE`之前，先在本地机器上创建`Node.js`单机集群(cluster)测试下，日志如下：

![Node.js cluster cron job schedule](https://ws4.sinaimg.cn/large/006tNc79ly1fziwwdp674j30kh0k5gpx.jpg)

一个`Node.js`实例运行在单线程中，充分利用多核计算机，我创建了 4 个进程（process），启动了 4 个`Node.js`应用程序实例作为集群（cluster）。

配置好的`cloud scheduler`作业：

![cloud scheduler task](https://ws4.sinaimg.cn/large/006tNc79ly1fzix4vuptaj31g00csmzf.jpg)

每分钟触发一次，发送一个消息到`cloud pub/sub`的`topic`中，`topic`和`subscription`组成消息队列（message queue，简称 mq）。在应用程序中使用`cloud pub/sub`监听该消息队列，消息流模型：

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzixcfas2uj30hu068mxh.jpg)

**选用 Publisher 1 => Topic => Subscription 1 => Subscriber 1, Subscriber 2**的消息流模型，`Publisher 1`即我们设置好的`cloud scheduler`作业，`Topic`和`Subscripion 1`组成消息队列，`cloud scheduler`作业会定时向消息队列中发送消息，订阅者`Subscriber 1`，`Subscriber 2`就是各个应用程序实例。**从消息流模型可以看出，各个订阅者之间获取消息是竞争关系，即一条消息只能被一个订阅者消费。**回到单机集群的日志，每分钟只有一个实例执行了该定时任务。

接下来开始部署到`GKE` cluster 中，将加入了该解决方案的应用程序容器化，`build`新的`image`，新的`tag`，并`push`到了`docker.io registry`。部署新的版本到`GKE`，命令如下：

```bash
☁  solution1 [master] ⚡  kubectl set image deployment/gke-cron-job-issue gke-cron-job-issue=docker.io/novaline/gke-cron-job-solution-1:1.2
deployment.apps "gke-cron-job-issue" image updated
☁  solution1 [master] ⚡
```

部署成功后，开启 3 个终端会话窗口，分别打印 3 个`pod`中`container`中应用程序的日志，手动触发`cloud scheduler`定时作业，观察日志：

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzm5ilq56sg31gr0cu4au.gif)

可见，始终只有一个应用程序实例执行定时任务，接收日报（daily report）邮箱每天收到一封邮件，这是我们想要的结果。
