# cloud-sql

**important**: Enable the Cloud SQL Admin API.

create secrets:

```bash
kubectl create secret generic cloudsql-instance-credentials \
    --from-file=credentials.json=/Users/ldu020/workspace/nodejs-gcp/src/kubernetes-engine/cloud-sql/.gcp/shadowsocks-218808-764d9795784f.json
```

```bash
kubectl create secret generic cloud-db-credentials \
    --from-literal=username=avstar --from-literal=password=avstarpass
```

```bash
☁  cloud-sql [master] ⚡  kubectl get secrets
NAME                            TYPE                                  DATA      AGE
cloud-db-credentials            Opaque                                2         56m
cloudsql-instance-credentials   Opaque                                1         29m
credentials                     Opaque                                7         6h
default-token-wlhxn             kubernetes.io/service-account-token   3         8h
```

## clean up

delete service

```bash
☁  cloud-sql [master] ⚡  kubectl delete service nodejs-hello-world
service "nodejs-hello-world" deleted
```

delete GKE clusters

```bash
☁  cloud-sql [master] ⚡  gcloud container clusters list
NAME        LOCATION    MASTER_VERSION  MASTER_IP       MACHINE_TYPE   NODE_VERSION   NUM_NODES  STATUS
nodejs-gcp  us-west1-a  1.10.11-gke.1   35.230.117.115  n1-standard-1  1.10.11-gke.1  3          RUNNING
☁  cloud-sql [master] ⚡  gcloud container clusters delete nodejs-gcp
The following clusters will be deleted.
 - [nodejs-gcp] in [us-west1-a]

Do you want to continue (Y/n)?  y

Deleting cluster nodejs-gcp...done.
Deleted [https://container.googleapis.com/v1/projects/shadowsocks-218808/zones/us-west1-a/clusters/nodejs-gcp].
```

delete cloud sql instance

```bash
☁  workspace  gcloud sql instances list
NAME        DATABASE_VERSION  LOCATION       TIER         PRIMARY_ADDRESS  PRIVATE_ADDRESS  STATUS
nodejs-gcp  POSTGRES_9_6      us-central1-a  db-f1-micro  130.211.208.111  -                RUNNABLE
☁  workspace  gcloud sql instances delete nodejs-gcp
All of the instance data will be lost when the instance is deleted.

Do you want to continue (Y/n)?  y

Deleting Cloud SQL instance...done.
Deleted [https://www.googleapis.com/sql/v1beta4/projects/shadowsocks-218808/instances/nodejs-gcp].
```

## reference

https://cloud.google.com/sql/docs/postgres/connect-kubernetes-engine
