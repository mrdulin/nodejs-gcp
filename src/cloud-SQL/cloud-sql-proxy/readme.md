# usage

build cloud sql proxy image:

```bash
docker build -t csp:1.0 .
```

run cloud sql proxy:

```bash
docker run -v /Users/ldu020/workspace/nimbus-cedar/cedar-graphql-api/.gcp:/.gcp -e GOOGLE_APPLICATION_CREDENTIALS=/.gcp/pg-gx-e-app-700458-98b46018b4ea.json csp:1.0 ./cloud_sql_proxy -instances=pg-gx-e-app-700458:us-central1:cedar-database=tcp:5432
```
