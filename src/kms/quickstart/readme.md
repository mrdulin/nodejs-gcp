# quickstart

列出密钥所有版本：

```bash
☁  quickstart [master] ⚡  gcloud kms keys versions list --location global --keyring=test --key=quickstart
NAME                                                                                                  STATE
projects/shadowsocks-218808/locations/global/keyRings/test/cryptoKeys/quickstart/cryptoKeyVersions/1  ENABLED
```

销毁密钥版本：

```bash
☁  quickstart [master] ⚡  gcloud kms keys versions destroy projects/shadowsocks-218808/locations/global/keyRings/test/cryptoKeys/quickstart/cryptoKeyVersions/1 --location global --keyring test --key quickstart
```

可以看到密钥的`STATE`成为了`DESTROY_SCHEDULED`

```bash
☁  quickstart [master] ⚡  gcloud kms keys versions list --location global --keyring=test --key=quickstart
NAME                                                                                                  STATE
projects/shadowsocks-218808/locations/global/keyRings/test/cryptoKeys/quickstart/cryptoKeyVersions/1  DESTROY_SCHEDULED
```

### references

- https://cloud.google.com/kms/docs/quickstart
