FROM mhart/alpine-node:12
WORKDIR /app

RUN apk add --no-cache make gcc g++ python3
COPY . .
RUN npm ci --prod

EXPOSE 8080
CMD ["node", "src/server/index.js"]
