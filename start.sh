#! /bin/sh

if (docker network ls | grep mockserver_network)
then
    echo "network already exists"
else
    docker network create mockserver_network
fi

if (docker ps | grep mockserver_mongo)
then
    echo "Mongo already running"
else
    echo "Starting mongo"
    docker run -d --rm --name mockserver_mongo --network=mockserver_network -p 27017:27017 mongo
fi

echo "Starting up mockserver api"

docker run -it --rm \
-p 8000:8080 \
--name=mockserver \
--network=mockserver_network \
mock-server-image

docker logs -f mockserver
