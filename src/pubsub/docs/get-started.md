# get-started

## 使用说明

```bash
☁  nodejs-gcp [master] ⚡  /Users/ldu020/workspace/nodejs-gcp/node_modules/.bin/ts-node src/pubsub/get-started/index.ts
2018-08-30T05:31:06.812Z[error] : "7 PERMISSION_DENIED: User not authorized to perform this action."
```

服务账号密钥文件中的用户没有进行该操作的权限。

解决方法：创建凭据 - 服务账号密钥 - 选择`google pubsub`的服务账号 - 密钥类型 `json` - 自动下载该文件

重新在终端`shell`中设置`GOOGLE_APPLICATION_CREDENTIALS`环境变量

```bash
☁  nodejs-gcp [master] ⚡  /Users/ldu020/workspace/nodejs-gcp/node_modules/.bin/ts-node src/pubsub/get-started/index.ts
2018-08-30T06:08:44.673Z[info] : ["projects/<project name>/subscriptions/my-sub","projects/<project name>/subscriptions/lin-sub"]
2018-08-30T06:08:44.736Z[info] : ["projects/<project name>/topics/cloud-builds","projects/<project name>/topics/my-topic","projects/<project name>/topics/lin-topic"]
```
