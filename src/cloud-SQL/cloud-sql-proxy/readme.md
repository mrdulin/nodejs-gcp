# usage

build cloud sql proxy image:

```bash
docker build -t -f ./Dockerfile csp:1.0 .
```

run cloud sql proxy in a terminal session window:

```bash
docker run -v ./.gcp:/.gcp -e GOOGLE_APPLICATION_CREDENTIALS=/.gcp/<xxx-credential.json> <image name>:<image tag> ./cloud_sql_proxy -instances=<INSTANCE_CONNECTION_NAME>=tcp:5432
```

open a new terminal session window:

```bash
docker exec -it <Container ID> psql "host=127.0.0.1 port=5432 sslmode=disable dbname=<DB_NAME> user=<USER_NAME>"
```

Enter database password
