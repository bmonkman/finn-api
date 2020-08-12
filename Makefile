OPENAPI_GENERATOR_VERSION=v5.0.0-beta
DOCKER_IMAGE?=finn-api:latest

generate:
	docker run -v ${PWD}:/tmp/ openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} generate -i /tmp/schema.yml -g nodejs-express-server -o /tmp/application
	npm install --save sqlite3 uuid https://github.com/bmonkman/finn-tone-client/releases/download/1.0.0/finn-tone-api-1.0.0.tgz --prefix application/

run:
	npm start --prefix application/

test:
	npm test --prefix application/

docs:
	docker run -v ${PWD}:/tmp/ openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} generate -i /tmp/schema.yml -g markdown -o /tmp/docs

docker:
	docker build . -t ${DOCKER_IMAGE}

deploy: docker
	docker tag ${DOCKER_IMAGE} bmonkman/${DOCKER_IMAGE}
	docker push bmonkman/${DOCKER_IMAGE}
	kubectl apply -f kubernetes/
	kubectl rollout restart deploy user-service

.PHONY: generate run test docs docker deploy
