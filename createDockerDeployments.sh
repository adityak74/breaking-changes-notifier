#!/bin/bash

echo "Building client application"
docker build -f app.Dockerfile .  -t breaking-changes-notifier-client > /dev/null &
while kill -0 $!; do
    printf '.' > /dev/tty
    sleep 2
done
echo "Built client app."

echo "Building server app"
docker build -f server.Dockerfile .  -t breaking-changes-notifier-app > /dev/null &
while kill -0 $!; do
    printf '.' > /dev/tty
    sleep 2
done
echo "Built Server app."

