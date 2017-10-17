# webpack compile after deploy

一直以来的做法是：在`GAE` `service`部署之前，在本地机器上，或者`jenkins`服务器上使用`npm run build`，通过`webpack`去`build`源码，将`.ts`编译成`.js`， 生成'./dist'目录，
然后通过`gcloud app deploy`部署，部署过程中会上传`./dist`目录，最后使用`node ./dist/main.js`启动应用。详见例子![work-with-webpack-success](../work-with-webpack-success)

另外一个思路： 在`GAE` `service`部署阶段，使用`webpack`去`build`源码， 然后通过`npm start`启动应用。但这种做法的前提是需要将所有的`node modules`安装在`package.json`
的`dependencies`字段中，因为`cloud build`在构建`docker` `image`的过程中是通过`npm install --production`命令去安装所有的依赖。其实从这一点就可以看出这个思路的不合理性，将
所有的`node modules`安装在`package.json`的`dependencies`字段中，`npm install --production`这个命令就失去了意义。

其中的环境变量传递流程为：

`app.yaml`的`env_variables` => `webpack.config.js`，并根据当前`cloud build`中的`process.env.NODE_ENV`设置`mode`（等价于`NODE_ENV=production webpack`） => `webpack`的`mode`配置会通过`definePlugin`替换应用程序中所有`process.env.NODE_ENV`为`mode`的值（`production`或者`development`）

部署过程没有报错，部署完成后，访问应用程序报错。通过`stackdriver logs`可以看到错误信息

https://stackoverflow.com/questions/53258686/how-do-i-build-my-source-code-using-webpack-at-gae-service-deploying-stage
