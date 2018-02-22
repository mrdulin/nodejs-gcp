# configmap

```bash
☁  configmap [master] kubectl create configmap envVars --from-env-file=.env
The ConfigMap "envVars" is invalid: metadata.name: Invalid value: "envVars": a DNS-1123 subdomain must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character (e.g. 'example.com', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*')
```

报错是因为不符合 configmap 命名规范, `envVars`改为`envs`

```bash
☁  configmap [master] ⚡  kubectl create configmap envs --from-env-file=.env
configmap "envs" created
```

```bash
☁  configmap [master] ⚡  kubectl get configmap envs -o yaml
apiVersion: v1
data:
  PROJECT_ID: shadowsocks-218808
  REGION: us-central1
  SQL_DATABASE: postgres
  SQL_INSTANCE_CONNECTION_NAME: shadowsocks-218808:us-central1:nodejs-gcp-instance
  SQL_PASSWORD: amdinpass
  SQL_SSL: "false"
  SQL_USER: admin
kind: ConfigMap
metadata:
  creationTimestamp: 2019-01-23T04:43:00Z
  name: envs
  namespace: default
  resourceVersion: "9455"
  selfLink: /api/v1/namespaces/default/configmaps/envs
  uid: 5cd3b363-1ec9-11e9-b7b1-42010a8a0128
```

delete configmap

```bash
☁  configmap [master] ⚡  kubectl delete configmap envs
configmap "envs" deleted
```
