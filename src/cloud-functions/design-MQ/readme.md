# Cloud Function 与 MQ 设计

两个后台函数 Cloud Function，分别是`updateCampaign`和`createCampaign`。

想法是让这两个 Cloud Function 监听同一个消息队列`design-mq`，消息队列使用 Cloud Pub/Sub 实现，
通过应用程序在`message`的`attributes`中添加`type`字段来区分具体哪个 Cloud Function 执行程序正常逻辑。

结果是这种设计并不好，缺点如下：

1. 设想有 10 个 Cloud Function，都监听同一个消息队列，那么当该消息队列中收到消息后，10 个 Cloud Function 都会被触发执行，尽管 Cloud Function 中有针对`type`字段的判断逻辑，但增加了 Cloud Function 无意义的执行次数

2. 每个 Cloud Function 中增加了额外的实际上没有意义的针对`type`字段的判断逻辑。

3. 除了导致 Cloud Function 增加无意义的执行次数，内存，CPU，带宽等资源同样占用，增加 Cloud Function 费用。

最好的设计也是最简单的设计就是让 Cloud Function 和 MQ 一一对应，简单说，就是一对一的关系。用本例来说，就是创建`update-campaign`消息队列，用来触发`updateCampaign`后台函数;
创建`create-campaign`消息队列，用来触发`createCampaign`后台函数。
