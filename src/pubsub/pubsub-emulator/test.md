# test cases

Test environment:

- pubsub-emulator
- OS: MacOS, Darwin US_C02WG0GXHV2V 17.7.0 Darwin Kernel Version 17.7.0: Thu Jan 23 07:05:23 PST 2020; root:xnu-4570.71.69~1/RELEASE_X86_64 x86_64
  - CPU: 3.5 GHz Intel Core i7
  - Memory: 16 GB 2133 MHz LPDDR3
- `@google/pubsub` version: `@google/pubsub@^1.7.3`
- `node` version: `v10.16.2`
- `npm` version: `6.14.4`

| messages | maxMessages | maxMilliseconds | subscribers | datetime (publishing last message) | datetime ( processing last message) | isPass | emulator error |
| -------- | ----------- | --------------- | ----------- | ---------------------------------- | ----------------------------------- | ------ | -------------- |
| 20k      | 1           | 1000            | 1           |                                    |                                     | failed |
| 20k      | 2           | 1000            | 1           |                                    |                                     | failed |
| 20k      | 2           | 1000            | 2           |                                    |                                     | passed |
| 20k      | 3           | 1000            | 1           |                                    |                                     | passed |
| 20k      | 5           | 1000            | 1           |                                    |                                     | passed |
| 20k      | 10          | 1000            | 1           |                                    |                                     | passed |
| 30k      | 10          | 1000            | 1           |                                    |                                     | failed |
| 30k      | 10          | 1000            | 2           |                                    |                                     | failed |
| 30k      | 10          | 1000            | 3           |                                    |                                     | failed |
| 30k      | 10          | 1000            | 4           |                                    |                                     | failed |
| 30k      | 20          | 1000            | 1           |                                    |                                     | failed |
| 30k      | 30          | 1000            | 1           |                                    |                                     | failed |
| 30k      | 40          | 1000            | 1           |                                    |                                     | failed |
| 30k      | 50          | 1000            | 1           |                                    |                                     | failed |
| 30k      | 60          | 1000            | 1           |                                    |                                     | failed |
| 30k      | 100         | 1000            | 1           |                                    |                                     | failed |
| 30k      | 500         | 1000            | 1           |                                    |                                     | passed | yes            |
| 30k      | 1000        | 1000            | 1           |                                    |                                     | passed | yes            |
| 30k      | 1500        | 1000            | 1           |                                    |                                     | passed | yes            |
| 30k      | 2000        | 1000            | 1           |                                    |                                     | passed | no             |
| 50k      | 1000        | 1000            | 1           |                                    |                                     | passed | yes            |
| 50k      | 1000        | 1000            | 2           | 2020-05-07T08:44:40.862Z           |                                     | failed | yes            |
| 50k      | 1000        | 1000            | 4           |                                    |                                     | failed | yes            |
| 50k      | 1000        | 1000            | 8           |                                    |                                     | failed | yes            |
| 50k      | 2000        | 1000            | 2           |                                    |                                     | passed | yes            |
| 50k      | 2000        | 1000            | 1           |                                    |                                     | passed | yes            |

emulator error:

```bash
[pubsub] May 07, 2020 5:44:01 PM io.grpc.netty.NettyServerHandler onStreamError
[pubsub] 警告: Stream Error
[pubsub] io.netty.handler.codec.http2.Http2Exception$StreamException: Stream closed before write could take place
[pubsub]        at io.netty.handler.codec.http2.Http2Exception.streamError(Http2Exception.java:149)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2RemoteFlowController$FlowState.cancel(DefaultHttp2RemoteFlowController.java:481)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2RemoteFlowController$1.onStreamClosed(DefaultHttp2RemoteFlowController.java:105)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2Connection.notifyClosed(DefaultHttp2Connection.java:356)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2Connection$ActiveStreams.removeFromActiveStreams(DefaultHttp2Connection.java:1000)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2Connection$ActiveStreams.deactivate(DefaultHttp2Connection.java:956)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2Connection$DefaultStream.close(DefaultHttp2Connection.java:512)
[pubsub]        at io.netty.handler.codec.http2.DefaultHttp2Connection.close(DefaultHttp2Connection.java:152)
[pubsub]        at io.netty.handler.codec.http2.Http2ConnectionHandler$BaseDecoder.channelInactive(Http2ConnectionHandler.java:221)
[pubsub]        at io.netty.handler.codec.http2.Http2ConnectionHandler.channelInactive(Http2ConnectionHandler.java:429)
[pubsub]        at io.grpc.netty.NettyServerHandler.channelInactive(NettyServerHandler.java:560)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:242)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:228)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:221)
[pubsub]        at io.netty.channel.ChannelInboundHandlerAdapter.channelInactive(ChannelInboundHandlerAdapter.java:75)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:242)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:228)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:221)
[pubsub]        at io.netty.handler.logging.LoggingHandler.channelInactive(LoggingHandler.java:167)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:242)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:228)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.fireChannelInactive(AbstractChannelHandlerContext.java:221)
[pubsub]        at io.netty.channel.DefaultChannelPipeline$HeadContext.channelInactive(DefaultChannelPipeline.java:1403)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:242)
[pubsub]        at io.netty.channel.AbstractChannelHandlerContext.invokeChannelInactive(AbstractChannelHandlerContext.java:228)
[pubsub]        at io.netty.channel.DefaultChannelPipeline.fireChannelInactive(DefaultChannelPipeline.java:912)
[pubsub]        at io.netty.channel.AbstractChannel$AbstractUnsafe$8.run(AbstractChannel.java:827)
[pubsub]        at io.netty.util.concurrent.AbstractEventExecutor.safeExecute(AbstractEventExecutor.java:163)
[pubsub]        at io.netty.util.concurrent.SingleThreadEventExecutor.runAllTasks(SingleThreadEventExecutor.java:404)
[pubsub]        at io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:495)
[pubsub]        at io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:905)
[pubsub]        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
[pubsub]        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
[pubsub]        at java.lang.Thread.run(Thread.java:748)
```
