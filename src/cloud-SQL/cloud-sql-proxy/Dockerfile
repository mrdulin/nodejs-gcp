FROM postgres:9.6

RUN apt-get update \
  && apt-get install -y wget \
  && apt-get purge -y --auto-remove \
  && wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy \
  && chmod +x cloud_sql_proxy




