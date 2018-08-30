# pub-sub

## 使用说明

1. 开启两个终端`shell`，并配置好`GOOGLE_APPLICATION_CREDENTIALS`环境变量

2. `shell 1`执行`subscribe.ts`文件，订阅`topic`

3. `shell 2`执行`publish.ts`文件，发布消息到`topic`, 或者在`GCP`上发布消息，见下图

![](https://ws4.sinaimg.cn/large/0069RVTdly1furq1whovyj310f08uq31.jpg)

![](https://ws1.sinaimg.cn/large/0069RVTdly1furq2ykwwyj30ma0bg0sq.jpg)

`shell 1`输出:

```bash
☁  nodejs-gcp [master] ⚡  $(npm bin)/ts-node src/pubsub/pub-sub/subscribe.ts
2018-08-30T06:36:00.921Z[info] : "subscribe lin-topic: "
2018-08-30T06:36:14.659Z[info] : {"connectionId":"f206c0fd-ee4f-4a82-865c-c1283b63ccca","ackId":"Pn4zNkVBXkASTDgDRElTK0MLKlgRTgQhIT4wPkVTRFAGFixdRkhRNxkIaFEOT14jPzUgKEUWIysDD2NaNBsNaFxcdAFUBRB6eDVwPAsZBwhFe059ZBoEa19ccwBVBBl2eGh0anLuprvwhNBEZh09WBJLLA","id":"193306749045910","attributes":{},"publishTime":"2018-08-30T06:36:14.524Z","received":1535610974658,"data":{"type":"Buffer","data":[103,114,97,112,104,113,108]},"length":7}
2018-08-30T06:36:14.660Z[info] : "message.id: 193306749045910"
2018-08-30T06:36:14.660Z[info] : "message.ackId: Pn4zNkVBXkASTDgDRElTK0MLKlgRTgQhIT4wPkVTRFAGFixdRkhRNxkIaFEOT14jPzUgKEUWIysDD2NaNBsNaFxcdAFUBRB6eDVwPAsZBwhFe059ZBoEa19ccwBVBBl2eGh0anLuprvwhNBEZh09WBJLLA"
2018-08-30T06:36:14.660Z[info] : "message.data: graphql"
2018-08-30T06:36:14.660Z[info] : "message.attributes: {}"
2018-08-30T06:36:14.660Z[info] : "message.received: 1535610974658"
```

## 参考

https://cloud.google.com/nodejs/docs/reference/pubsub/0.19.x/Subscription

https://cloud.google.com/nodejs/docs/reference/pubsub/0.19.x/Publisher
