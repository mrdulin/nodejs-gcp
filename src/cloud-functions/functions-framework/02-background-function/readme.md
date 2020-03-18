# events

Send POST Request to Simulate Pub/Sub messages

```bash
curl -d "@mockPubsub.json" \
  -X POST \
  -H "Ce-Type: true" \
  -H "Ce-Specversion: true" \
  -H "Ce-Source: true" \
  -H "Ce-Id: true" \
  -H "Content-Type: application/json" \
  http://localhost:8080
```

## references

- https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/events.md
