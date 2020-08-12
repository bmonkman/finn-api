# Simple API in Node generated with OpenAPI

API at https://finntest.commitzero.com

Schema at https://finntest.commitzero.com/openapi

Docs / Playground at https://finn-apidocs.commitzero.com/

(Hit "Try it out" to try calls to each endpoint)


## Setup instructions:

Running locally:

```
make generate
make run
```

Running tests:
```
make test
```

Running in docker:
```
make docker
docker run -p 3000:3000 finn-api:latest
```

Deploying to Kubernetes (assuming kubectl is configured):
```
make deploy
```
