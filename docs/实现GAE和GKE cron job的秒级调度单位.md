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

如前文所说，最小调度单位都是分钟，定时作业的执行时刻，只能精确到分钟。



