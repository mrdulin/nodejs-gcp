# cloud functions

## 部署

`oauth`认证

```bash
☁  background [master] ⚡  gcloud auth login
Your browser has been opened to visit:

    https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8085%2F&prompt=select_account&response_type=code&client_id=32555940559.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&access_type=offline


WARNING: `gcloud auth login` no longer writes application default credentials.
If you need to use ADC, see:
  gcloud auth application-default --help

You are now logged in as [lin.l.du@gmail.com].
Your current project is [pg-gx-e-app-700458].  You can change this setting by running:
  $ gcloud config set project PROJECT_ID
```

执行该命令后会打开浏览器，登录 google 账号

设置当前项目:

```bash
☁  background [master] ⚡  gcloud config set project pg-gx-e-app-700458
Updated property [core/project].
```

查看当前激活的账号：

```bash
☁  background [master] ⚡  gcloud auth list
 Credentialed Accounts
ACTIVE  ACCOUNT
*       lin.l.du@gmail.com
        novaline@qq.com

To set the active account, run:
    $ gcloud config set account `ACCOUNT`
```

查看`gcloud`当前配置:

```bash
☁  background [master] ⚡  gcloud config list
[core]
account = lin.l.du@gmail.com
disable_usage_reporting = True
project = pg-gx-e-app-700458

Your active configuration is: [default]
```
