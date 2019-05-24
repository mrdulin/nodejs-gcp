# 使用Slack Commands配合Cloud Function控制Compute Engine

### 前言

GCP的云服务都有各自的计费模型，对于中小企业尤其是个人开发者，怎么最大化的节省成本是个值得研究的问题。涉及到架构的选型，应用程序的优化等等。比如，对于应用程序的开发和运行初期，用户数量不多，功能少而精，应该选择配置低，成本小的云服务器，这样可以将一些性能问题放大，尽早的暴露出来。

阅读这篇文章需要熟悉以下技术栈：

- Node.js/Express.js
- Google Compute Engine
- Google Cloud Function
- Slack/Slack Command
- ngrok(optional)

云平台都大同小异，如果你熟悉其他云平台，比如AWS（lambda, ec2）,  阿里云，腾讯云，实现的流程也基本类似，我这里以GCP为例，列出关键的步骤和流程。

### 问题

任何技术语言都是为了解决问题，先说一下问题：

我用来魔法上网的代理服务器搭建在Google Compute Engine的一个instance上，可以理解为云服务器实例，可能是虚拟出来的，也可能是物理主机，这里不去深究，后续简称GCE instance。白天我在公司工作不需要魔法上网，只有晚上回家后才需要，但是我不想GCE instance全天24小时运行，有同学可能会问，为什么？因为穷。

来看下我GCP某两个月使用GCE instance的账单:

费用高的一个月：

![compute-engine-billing-2018-11](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/compute-engine-billing-2018-11.png)

费用低的一个月：

![compute-engine-billing-2018-12](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/compute-engine-billing-2018-12.png)

我们看下红色线框出来的部分，简单理解为GCE instance的运行时间，后面的金额，不带负号的是支出费用，带负号的表示抵扣，比如使用信用卡300USD免费额度，折扣，比如持续使用折扣（ Sustained Usage Discount ）。

其他费用还包括入站，出站流量费用，磁盘使用量，内存等等。让我感觉GCE就像一头牛，哪个部位都能割了卖钱。

可以看到，费用高的那个月，GCE instance运行了538.33小时，支出4.95USD，费用低的那个月，GCE instance运行了135.01小时，支出1.24USD。引出问题：如何对GCE instance做到，什么时候用，什么启动，不用就停止，从而节省成本？

### 方案评估

1. 使用定时任务cron job，每天20:00时开启，第二天00:00时关闭，每天固定运行4小时。
2. 使用GitHub webhooks, 使用特定的webhooks触发Google Cloud Function，在Cloud Function中对GCE进行启停操作，GitHub在天朝目前可以不用魔法上网访问。
3. 使用[Slack Commands](https://api.slack.com/slash-commands)，相比GitHub webhooks，命令的方式更加语义化，在天朝不需要魔法上网也可以使用，ios端App Store天朝区可以下载到[Slack](https://itunes.apple.com/cn/app/slack/id618783545?mt=8)应用。

方案必须要满足的一个条件是，必须在不能魔法上网的网络情况下在天朝能访问，然后发出指令，进行一系列流程启动GCE instance，从而启动代理服务器，这里怎么启动代理服务器稍后会讲到。

### 解决方案

直接选方案3，其他两种方案可以，但是用起来不爽，也不是本文的主题。简单介绍一下Slack Command，看图说话：

![slack-command-intro](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/slack-command-intro.png)

玩过Telegram的同学估计很熟悉，也知道我后续要干嘛了。Slack Command命令总是使用`/`符号开头，在输入框中输入`/away`命令，会将slack中的我的状态设置为离开，类似QQ状态的离开状态。在Slack输入框中输入Slack Command，会发送一个HTTP POST请求到你的slack应用，或者其他外部服务，用来与外部服务集成。简单说，一个Slack Command就可以让你发送一个携带命令信息的HTTP POST请求到任何可以接收HTTP请求的应用或服务。

然后是GCP这块，提供了Google Cloud API，支持REST和gRPC接口。简单说，GCP上的大部分云服务都有对应的API，你可以把GCP的每个云服务和资源当作是一个Restful resource，我们可以通过Restful API对云服务上的资源进行操作，除了CURD，还有其他的操作，比如GCE instance的start, stop。

然后来看下serverless架构之Cloud Function的优点，

![google-cloud-functions-intro](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/google-cloud-functions-intro.png)

并且Cloud Function的计费模型也很符合我的需求，主要有3点，调用次数，计算（运行）时间，网络流量。调用次数和网络流量都有一定的免费额度，调用次数每月前200万次调用免费，入站(ingress)流量免费，出站(egress)每个月5GB免费额度，对于我这种小功能，肯定用不完免费额度。计算时间费用相比compute节省的费用，可以忽略不计。

### 架构图

![control-compute-engine](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/control-compute-engine.png)

### 架构实施

#### Compute Engine

创建GCE instance的过程我就不说了，文档说的很详细。我已经在Google Console(web控制台)手动创建好了一个GCE instance如下：

![gce-instance-ssr](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/gce-instance-ssr.png)

配置好了防火墙(firewall)，绑定了静态IP，下面说整个流程中不可少的一环：startup script, 启动脚本。文章开头提到了如何让GCE instance启动时，也启动代理服务器，这里用的是shadowsocks server。点击GCE instance名称ssr进入GCE instance详情页面，这里我通过gcloud sdk给GCE instance设置好了启动脚本，你也可以手动设置，或者通过API设置，设置好如下：

![gce-instance-startup-script](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/gce-instance-startup-script.png)

该启动脚本以daemon(-d)方式，使用我预先配置好的配置文件(-c ssr-config.json)启动shadowsocks server。这样每次GCE instance启动时，就会执行该启动脚本，从而启动shadowsocks server。

可以简单验证下启动脚本是否正常运行，使用gcloud sdk，启动GCE instance：

```bash
gcloud compute instances start ssr
```

通过ssh登录到GCE instance上:

```bash
gcloud compute ssh ssr
```

查看进程中是否有ssserver:

```bash
~$ ps aux | grep ssserver
root      1641  0.0  1.6  44132 10060 ?        Ss   12:02   0:00 /usr/bin/python /usr/local/bin/ssserver -c /var/ssr-conf.json -d start
ldu020    1644  0.0  0.3  10480  2204 pts/2    S+   12:02   0:00 grep --color=auto ssserver
```

#### Cloud Function

下面开始编写和部署Cloud Function，之前说过，GCP上的云服务及资源都提供了API可以调用，可以通过Restful或者gRPC接口去调用，但是这里为了省时省力，我使用另一种方式，使用GCP提供的Node.js client library，内部封装了REST和gRPC的接口。浏览一下GCE Node.js Client Library有哪些接口：

![compute-client-api-reference](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/compute-client-api-reference.png)

有防火墙，磁盘管理，网络，快照，这里使用VM的接口，很简单，用到3个方法：[start](https://cloud.google.com/nodejs/docs/reference/compute/0.12.x/VM#start), [stop](https://cloud.google.com/nodejs/docs/reference/compute/0.12.x/VM#stop), [waitFor](https://cloud.google.com/nodejs/docs/reference/compute/0.12.x/VM#waitFor)。将来会在Cloud Function中使用这3个方法完成功能。

先写一个简单的HTTP Cloud Function：

![http-cloud-function](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/simple-cloud-function.png)

好，暂时先放着，接着来看看如何创建Slack Command。

#### Slack Command

创建Slack App

![create-a-slack-app](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/create-a-slack-app.png)

填写App Name，稍后不满意可以更改。Slack Workspace选择自己的，我这里叫home。点击Create App，进行下一步：

![build-slack-command-app](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/build-slack-command-app.png)

可以看到这里可以添加的功能有6种，这里选择Slack Commands

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521223443.png)

我这里已经创建好了一个Slack Command，名字叫`/vm` ，描述信息是"操作GCE instance"。新的Slack Command可以点击"Create New Command"按钮进行创建。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521224059.png)

我这里以创建好的Slack Command作为演示，所以这里是Edit Command。

Command: `/vm`，这是创建的Slack Command命令

Request URL: `https://4d17e320.ngrok.io/vm`，使用`ngrok`实现内网穿透，将Slack Command发送的HTTP POST请求转发到`http://localhost:3001/vm`，用来本地调试Cloud Function。稍后讲解

Short Description: Slack Command的描述信息，在Slack输入框中输入Slack Command时，会有相应的描述信息。

Usage Hint: Slack Command命令使用提示，命令支持传递参数，具体为：`/vm start`， `/vm stop`

最后可以看一下Slack Command在输入框中的效果预览（Preview of Autocomplete Entry），完成。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521225119.png)

点击Your Apps，回到应用列表，点击App Name，进入应用基本信息

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521225247.png)

点击Install App to Workspace，安装刚才创建的Slack Command应用到Workspace。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521225515.png)

点击Authorize，即可完成安装。接下来，我们继续回到Cloud Function的编写和调试。为了在本地联调Cloud Function和Slack Command，在本地搭建一个HTTP Server，这里使用Node.js老牌web framework，Express.js

```js
const express = require('express');
const bodyParser = require('body-parser');
const { operateVM } = require('./demo');

const app = express();
const PORT = '3001';

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.get('/healthy-check', (req, res) => {
  res.sendStatus(200);
});

app.post('/vm', operateVM);

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
```

将之前写好的Cloud Function引入进来，这里是`operateVM`，作为`/vm`路由的`controller`（无所谓，随便怎么叫）。还需要`bodyParser`中间件，解析Slack Command发送过来的HTTP POST请求中的payload。启动HTTP Server:

```bash
server is listening on http://localhost:3001
```

接着，启动`ngrok`:

```bash
☁  ~  ./ngrok http 3001
```

启动成功如下所示:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521230933.png)

刚才在创建Slack Command，填写Requst URL的时候已经介绍过了，`ngrok`实现内网穿透，将发送到`https://4d17e320.ngrok.io/vm`的流量(traffic)转发到`http://localhost:3001`。

好了，可以在Slack聊天窗口中输入刚才创建的Slack Command了，先在PC桌面平台测试下。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521230640.png)



输入`/vm start`，可以看到本地启动的HTTP Server收到如下信息：

```bash
{ token: '<secure token>',
  team_id: 'T8T8RSHR8',
  team_domain: 'slideshowp2',
  channel_id: 'C8UAHLWK1',
  channel_name: 'general',
  user_id: 'U8UAHLU15',
  user_name: 'novaline',
  command: '/vm',
  text: 'start',
  response_url: 'https://hooks.slack.com/commands/T8T8RSHR8/644018416870/aLWefuACLofTtv5Qxhu16XGd',
  trigger_id: '630425275506.299297901858.f21221f7cc0c59c71827fa649a9a28c7' }
```

有了这些字段信息，就可以实现Cloud Function的具体逻辑了。这里就省略具体实现逻辑了，有兴趣的同学可以看示例源代码。

Cloud Function逻辑编写完成，使用gcloud SDK进行部署，部署命令：

```bash
gcloud functions deploy operateVM --trigger-http --memory=128 --runtime=nodejs8
```

部署完成后，在命令行标准输出中，或者gcloud console（web控制台）中，进入Cloud Function详情，可以找到Cloud Function在公网可以访问的URL地址。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190521232810.png)

用这个地址去Slack Command中替换Request URL，将之前填写的`ngrok`的地址`https://4d17e320.ngrok.io/vm`替换成Cloud Function的URL地址，这样Slack Command就和Cloud Function集成起来了。后续Slack Command发送的HTTP POST请求会发送到Cloud Function的这个URL地址。

### 效果演示

以iPhone为例，先用天朝网络访问油管

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WechatIMG873.jpeg)



然后打开Slack，登录到刚才安装了Slack Command的Slack Workspace，天朝网络可以访问Slack，这是很关键的。输入`/vm start`，等2，3秒，Cloud Function会发送一条消息过来告诉我当前GCE instance的运行状态。（这里Cloud Function返回的消息是需要自己实现的）。"VM is running"，说明GCE instance已经处于运行状态，当然这里还需要等待启动脚本的执行时间，启动脚本启动代理服务器的时间，整个过程大概需要10秒。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WechatIMG877.jpeg)

接下来开启ios端代理服务器连接app



![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WechatIMG874.jpeg)



连接GCE instance上的shadowsocks代理服务器后，再次访问油管



![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WechatIMG876.jpeg)



第一张广告的动作很符合现在的心情。

当我不魔法上网时，在Slack中发送`/vm stop`命令。



![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WechatIMG878.jpeg)

Cloud Function发送"VM is terminated"消息回来，表示GCE instance停止运行。

至此，大致介绍完了整个流程。实现了GCE instance的随时启用，随时停止，至少能节省3USD，将每个月作为魔法上网使用的GCE instance成本压缩到2USD以内。



### 参考

- [Google Compute Engine 价格](https://cloud.google.com/compute/pricing)

- [Google Cloud 价格计算器](https://cloud.google.com/products/calculator/)

- [持续使用折扣](https://cloud.google.com/compute/docs/sustained-use-discounts)

- [Google Cloud API](https://cloud.google.com/apis/docs/overview)

- [Cloud Function Pricing](https://cloud.google.com/functions/pricing)

- [运行启动脚本](https://cloud.google.com/compute/docs/startupscript)

- [ngrok](https://ngrok.com/)

  

------

<a href="https://info.flagcounter.com/ab0j"><img src="https://s11.flagcounter.com/count2/ab0j/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_12/viewers_0/labels_1/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a>