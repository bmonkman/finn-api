# Build stage - for generating code
FROM openapitools/openapi-generator-cli:v5.0.0-beta AS builder
COPY schema.yml .
RUN docker-entrypoint.sh generate -i schema.yml -g nodejs-express-server -o /app

# Run stage - for running the app
FROM node:14.7.0-alpine
RUN apk add --no-cache ca-certificates tini sqlite
WORKDIR /app
COPY --from=builder /app .
COPY application/package.json .
COPY application/services services/
COPY application/db db/
RUN npm install
ENTRYPOINT ["/sbin/tini", "npm", "start", "--prefix", "/app"]
