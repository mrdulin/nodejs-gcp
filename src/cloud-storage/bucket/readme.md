# get-started

## 使用说明

需要`GCP`认证

```bash
☁  nodejs-gcp [master] ⚡  $(npm bin)/ts-node src/google-storage/get-started/index.ts
2018-08-30T03:50:46.401Z[error] : "Unexpected error while acquiring application default credentials: Could not load the default credentials. Browse to https://developers.google.com/accounts/docs/application-default-credentials for more information."
```

使用 OAuth 2.0 客户端的密钥文件

```bash
☁  nodejs-gcp [master] ⚡  export GOOGLE_APPLICATION_CREDENTIALS=/Users/ldu020/workspace/client_secret_728574703134-gd78v29q98i3v626aepeqcphacvmufcu.apps.googleusercontent.com.json
☁  nodejs-gcp [master] ⚡  $(npm bin)/ts-node src/google-storage/get-started/index.ts
2018-08-30T03:54:24.094Z[error] : "The incoming JSON object does not contain a client_email field"
```

使用服务账号密钥

```bash
☁  nodejs-gcp [master] ⚡  export GOOGLE_APPLICATION_CREDENTIALS=/Users/ldu020/workspace/<project name>-c537daa7b331.json
☁  nodejs-gcp [master] ⚡  $(npm bin)/ts-node src/google-storage/get-started/index.ts
2018-08-30T04:03:03.509Z[info] : "Buckets:"
2018-08-30T04:03:03.510Z[info] : "xxx-dev-mongo-backup"
2018-08-30T04:03:03.510Z[info] : "xxx-zee"
2018-08-30T04:03:03.510Z[info] : "<project name>.appspot.com"
2018-08-30T04:03:03.510Z[info] : "staging.<project name>.appspot.com"
2018-08-30T04:03:03.510Z[info] : "us.artifacts.<project name>.appspot.com"
```

## 参考

- https://cloud.google.com/docs/authentication/getting-started
