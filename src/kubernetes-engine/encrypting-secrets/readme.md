# kubernetes engine cncrypting secrets

## steps

check project region

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud config list
```

create keyring

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud kms keyrings create nodejs-gcp-k8s --location asia-northeast1 --project shadowsocks-218808
```

create crypto key

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud kms keys create nodeje-gcp-k8s-key --location asia-northeast1 --keyring nodejs-gcp-k8s --purpose encryption --project shadowsocks-218808
```

list crypto keys:

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud kms keys list --location=asia-northeast1 --keyring=nodejs-gcp-k8s
NAME                                                                                                         PURPOSE          LABELS  PRIMARY_ID  PRIMARY_STATE
projects/shadowsocks-218808/locations/asia-northeast1/keyRings/nodejs-gcp-k8s/cryptoKeys/nodeje-gcp-k8s-key  ENCRYPT_DECRYPT          1           ENABLED
```

go GCP - IAM & admin, check GKE service account: `service-16536262744@container-engine-robot.iam.gserviceaccount.com`

grant `cloudkms.cryptoKeyEncrypterDecrypter` role to service account

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud kms keys add-iam-policy-binding nodeje-gcp-k8s-key --location asia-northeast1 --keyring nodejs-gcp-k8s --member serviceAccount:service-16536262744@container-engine-robot.iam.gserviceaccount.com --role roles/cloudkms.cryptoKeyEncrypterDecrypter --project shadowsocks-218808
Updated IAM policy for key [nodeje-gcp-k8s-key].
bindings:
- members:
  - serviceAccount:service-16536262744@container-engine-robot.iam.gserviceaccount.com
  role: roles/cloudkms.cryptoKeyEncrypterDecrypter
etag: BwWGUhrd2gI=
```

create kubernetes clusters

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud beta container clusters create nodejs-gcp --zone asia-northeast1-a --database-encryption-key projects/shadowsocks-218808/locations/asia-northeast1/keyRings/nodejs-gcp-k8s/cryptoKeys/nodeje-gcp-k8s-key --project shadowsocks-218808
ERROR: (gcloud.beta.container.clusters.create) unrecognized arguments:
  --database-encryption-key
  projects/shadowsocks-218808/locations/asia-northeast1/keyRings/nodejs-gcp-k8s/cryptoKeys/nodeje-gcp-k8s-key
  To search the help text of gcloud commands, run:
  gcloud help -- SEARCH_TERMS
```

If get this error, should update `gcloud` sdk to latest version.

check gcloud version:

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud version
Google Cloud SDK 231.0.0
beta 2019.01.19
bq 2.0.40
core 2019.01.19
gsutil 4.35
kubectl 2018.09.17
Updates are available for some Cloud SDK components.  To install them,
please run:
  $ gcloud components update%
```

`gcloud` current version: 231.0.0

`--database-encryption-key` flag added in version 232.0.0. see https://cloud.google.com/sdk/docs/release-notes#kubernetes_engine_6

update `gcloud` version:

```bash
gcloud components update
```

create kubernetes clusters:

```bash
Creating cluster nodejs-gcp in asia-northeast1-a... Cluster is being health-checked (master is healthy)...done.
Created [https://container.googleapis.com/v1beta1/projects/shadowsocks-218808/zones/asia-northeast1-a/clusters/nodejs-gcp].
To inspect the contents of your cluster, go to: https://console.cloud.google.com/kubernetes/workload_/gcloud/asia-northeast1-a/nodejs-gcp?project=shadowsocks-218808
kubeconfig entry generated for nodejs-gcp.
NAME        LOCATION           MASTER_VERSION  MASTER_IP      MACHINE_TYPE   NODE_VERSION   NUM_NODES  STATUS
nodejs-gcp  asia-northeast1-a  1.11.7-gke.12   35.190.234.20  n1-standard-1  1.11.7-gke.12  3          RUNNING
```

verify the cluster is using application-layer encrypting or not

```bash
☁  kubernetes-engine-encrypting-secrets [master] ⚡  gcloud beta container clusters describe nodejs-gcp --zone asia-northeast1-a --format 'value(databaseEncryption)' --project shadowsocks-218808
keyName=projects/shadowsocks-218808/locations/asia-northeast1/keyRings/nodejs-gcp-k8s/cryptoKeys/nodeje-gcp-k8s-key;state=ENCRYPTED
```

## 参考

https://cloud.google.com/compute/docs/regions-zones/
https://cloud.google.com/kubernetes-engine/docs/how-to/encrypting-secrets
