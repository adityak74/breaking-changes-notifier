#!/bin/bash

echo "Building client application"
docker build -f app.Dockerfile .  -t breaking-changes-notifier-client
echo "Built client app."

echo "Building server app"
docker build -f server.Dockerfile .  -t breaking-changes-notifier-app
echo "Built Server app."

echo "Tagging client app"
docker tag breaking-changes-notifier-client ghcr.io/adityak74/bcn-client-app:latest
echo "Tagged client app"

echo "Tagging server app"
docker tag breaking-changes-notifier-app ghcr.io/adityak74/bcn-server-app:latest
echo "Tagged server app"

echo "Authenticating to ghcr"
cat git.token.txt | docker login ghcr.io -u adityak74 --password-stdin

echo "Pushing client/server app"
docker push ghcr.io/adityak74/bcn-client-app:latest
docker push ghcr.io/adityak74/bcn-server-app:latest
echo "Pushed to ghcr."
