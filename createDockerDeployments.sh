#!/bin/bash

echo "Building client application"
docker build -f app.Dockerfile .  -t breaking-changes-notifier-client > /dev/null &
echo "Built client app."

echo "Building server app"
docker build -f server.Dockerfile .  -t breaking-changes-notifier-app > /dev/null &
echo "Built Server app."

