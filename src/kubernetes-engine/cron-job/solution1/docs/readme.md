# gke cron job solution 1

https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app#step_4_create_a_container_cluster

## issues

> (node:16) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: 7 PERMISSION_DENIED: Request had insufficient authentication scopes.

```bash
kubectl create secret generic google-application-credentials --from-file=application-credentials.json=/Users/ldu020/workspace/nodejs-gcp/.gcp/shadowsocks-218808-7f8e109f4089.json
```

update `deployment.yaml`
