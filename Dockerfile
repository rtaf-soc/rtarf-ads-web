FROM node:22.14.0-alpine3.21 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM node:22.14.0-alpine3.21
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]

