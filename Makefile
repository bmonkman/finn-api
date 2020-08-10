OPENAPI_GENERATOR_VERSION=v5.0.0-beta
DOCKER_IMAGE?=finn-api:latest
generate:
	docker run -v ${PWD}:/tmp/ openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} generate -i /tmp/schema.yml -g nodejs-express-server -o /tmp/application
	npm install --save sqlite3 uuid --prefix application/

run:
	npm start --prefix application/

test:
	npm test --prefix application/

docs:
	docker run -v ${PWD}:/tmp/ openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} generate -i /tmp/schema.yml -g markdown -o /tmp/docs

docker:
	docker build . -t ${DOCKER_IMAGE}

deploy: docker
	docker tag finn-api:latest bmonkman/finn-api:latest
	docker push bmonkman/finn-api:latest
	kubectl apply -f kubernetes/
	kubectl rollout restart deploy api-service

.PHONY: generate run test docs docker deploy
