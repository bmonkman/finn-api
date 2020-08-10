OPENAPI_GENERATOR_VERSION=v5.0.0-beta
DOCKER_IMAGE?=finn-api:latest
generate:
	docker run -v ${PWD}:/tmp/ openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} generate -i /tmp/schema.yml -g nodejs-express-server -o /tmp/application

run:
	npm start --prefix application/

test:
	npm test --prefix application/

docs:
	docker run -v ${PWD}:/tmp/ openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} generate -i /tmp/schema.yml -g markdown -o /tmp/docs

docker:
	docker build . -t ${DOCKER_IMAGE}

.PHONY: generate run test docs
