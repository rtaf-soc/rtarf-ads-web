FROM node:18.16.0-alpine3.18 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM node:18.16.0-alpine3.18
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
