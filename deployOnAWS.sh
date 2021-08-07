echo "Stopping contianer"
docker stop $(docker ps | grep bcn | awk '{print $1}')
echo "Removing containers"
docker rm $(docker ps -a | grep bcn | awk '{print $1}')
echo "Creating docker network"
docker network create -d bridge bcp-network
echo "Pulling docker images"
cat git.token.txt | docker login ghcr.io -u adityak74 --password-stdin
docker pull ghcr.io/adityak74/bcn-client-app:latest
docker pull ghcr.io/adityak74/bcn-server-app:latest
echo "Pulled docker images"
echo "Deploying images"
docker run --name bcn-app-client -p 5000:80 -d --network=bcp-network ghcr.io/adityak74/bcn-client-app
docker run --name bcn-app-server -p 3000:3000 -d -e PORT='3000' --network=bcp-network ghcr.io/adityak74/bcn-server-app
echo "Deployed images"