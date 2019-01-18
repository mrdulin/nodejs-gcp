# deploy-container

```bash
☁  deploy-container [master] ⚡  gcloud auth configure-docker
The following settings will be added to your Docker config file
located at [/Users/ldu020/.docker/config.json]:
 {
  "credHelpers": {
    "gcr.io": "gcloud",
    "us.gcr.io": "gcloud",
    "eu.gcr.io": "gcloud",
    "asia.gcr.io": "gcloud",
    "staging-k8s.gcr.io": "gcloud",
    "marketplace.gcr.io": "gcloud"
  }
}

Do you want to continue (Y/n)?  y

Docker configuration file updated.
```

Tag the local image with the registry name

```bash
☁  deploy-container [master] ⚡  docker tag gce-deploy-container:latest asia.gcr.io/shadowsocks-218808/gce-deploy-container:latest
☁  deploy-container [master] ⚡  docker images
REPOSITORY                                            TAG                 IMAGE ID            CREATED             SIZE
asia.gcr.io/shadowsocks-218808/gce-deploy-container   latest              0e32fd9a0b8b        3 minutes ago       98MB
gce-deploy-container                                  latest              0e32fd9a0b8b        3 minutes ago       98MB
csp                                                   1.1                 ab1999d6ad6f        3 days ago          262MB
angular-apollo-starter                                v1.0                c500f1c77099        8 days ago          16MB
postgres                                              9.6                 ed34a2d5eb79        2 weeks ago         230MB
nginx                                                 latest              7042885a156a        2 weeks ago         109MB
node                                                  8.9-alpine          406f227b21f5        10 months ago       68.1MB
nginx                                                 1.13.3-alpine       ba60b24dbad5        18 months ago       15.5MB
```

Push the tagged image to Container Registry

```bash
☁  deploy-container [master] ⚡  docker push asia.gcr.io/shadowsocks-218808/gce-deploy-container
The push refers to repository [asia.gcr.io/shadowsocks-218808/gce-deploy-container]
a66f1e9b9409: Pushed
12514e6ca60a: Pushed
60d9674ecd45: Pushed
ba6263e52fa9: Pushed
f846841ed47f: Pushed
0198944a9875: Pushed
9dfa40a0da3b: Layer already exists
latest: digest: sha256:408523c188436bcb0e648b6c7e82ab11916925ae96fc21aebc8025e34ce88dce size: 1784
```

check images

```bash
☁  deploy-container [master] ⚡  gcloud container images list --repository=asia.gcr.io/shadowsocks-218808
NAME
asia.gcr.io/shadowsocks-218808/app-engine-tmp
asia.gcr.io/shadowsocks-218808/appengine
asia.gcr.io/shadowsocks-218808/gce-deploy-container
```

## references

- https://cloud.google.com/container-registry/docs/pushing-and-pulling
- https://cloud.google.com/compute/docs/containers/configuring-options-to-run-containers
