#!/bin/bash

TOPIC='scheduleJob'
SUB='scheduleJobSub'

gcloud pubsub topics create $TOPIC \
&& gcloud pubsub subscriptions create $SUB --topic=$TOPIC

