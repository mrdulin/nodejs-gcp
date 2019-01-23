# quick start

tag image

```bash
docker tag nodejs-hello-world novaline/nodejs-hello-world:1.0
```

push image to docker hub registry

```bash
docker push novaline/nodejs-hello-world
```

create the deployment

```bash
☁  quick-start [master] ⚡  kubectl run nodejs-hello-world --image docker.io/novaline/nodejs-hello-world:1.0 --port 8080
deployment.apps "nodejs-hello-world" created
```

expose the deployment

```bash
☁  quick-start [master] ⚡  kubectl expose deployment nodejs-hello-world --type LoadBalancer --port 80 --target-port 8080
service "nodejs-hello-world" exposed
```

Inspect the `nodejs-hello-world` Service

```bash
☁  quick-start [master] ⚡  kubectl get service nodejs-hello-world
NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nodejs-hello-world   LoadBalancer   10.11.253.240   <pending>     80:31697/TCP   38s
```

## refs

https://cloud.google.com/kubernetes-engine/docs/quickstart?hl=zh-cn
