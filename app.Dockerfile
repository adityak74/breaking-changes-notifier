FROM mhart/alpine-node:12
WORKDIR /app

RUN apk add --no-cache make gcc g++ python3
COPY . .
RUN npm install
RUN npm run build

FROM nginx
WORKDIR /app

COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
