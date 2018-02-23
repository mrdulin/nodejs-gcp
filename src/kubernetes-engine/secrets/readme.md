# secrets

create secrets from `.env` file

```bash
☁  secrets [master] ⚡  kubectl create secret generic credentials --from-env-file=.env
secret "credentials" created
```

Running `kubectl get secret credentials -o yaml` returns the following output.

```bash
☁  secrets [master] ⚡  kubectl get secret credentials -o yaml
apiVersion: v1
data:
  PROJECT_ID: c2hhZG93c29ja3MtMjE4ODA4
  REGION: dXMtY2VudHJhbDE=
  SQL_DATABASE: cG9zdGdyZXM=
  SQL_INSTANCE_CONNECTION_NAME: c2hhZG93c29ja3MtMjE4ODA4OnVzLWNlbnRyYWwxOm5vZGVqcy1nY3AtaW5zdGFuY2U=
  SQL_PASSWORD: YW1kaW5wYXNz
  SQL_SSL: ZmFsc2U=
  SQL_USER: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: 2019-01-23T05:04:28Z
  name: credentials
  namespace: default
  resourceVersion: "11842"
  selfLink: /api/v1/namespaces/default/secrets/credentials
  uid: 5c7844f3-1ecc-11e9-b7b1-42010a8a0128
type: Opaque
```

check deployment

```bash
☁  secrets [master] ⚡  kubectl get deployments
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nodejs-hello-world   1         1         1            1           6m
```

edit deployment yaml file from local using `vscode`

```bash
☁  secrets [master] ⚡  KUBE_EDITOR="code" kubectl edit deployment nodejs-hello-world
Edit cancelled, no changes made.
```

update the deployment

```bash
☁  secrets [master] ⚡  kubectl apply -f /var/folders/38/s8g_rsm13yxd26nwyqzdp2shd351xb/T/kubectl-edit-03pu3.yaml
deployment.extensions "nodejs-hello-world" configured
```
