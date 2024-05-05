#!/bin/bash

echo "*** REMEMBER TO BE CONNECTED TO VPN ***"
DOCKER_IMAGE="tommy1997/tstats_frt_img"
DOCKER_CONTAINER_NAME="tstats_frt_container"

#build and push new image
docker build -t $DOCKER_IMAGE .
docker push $DOCKER_IMAGE

#recreate image/container in remote
ssh -t tomeu@192.168.1.196 "
    docker stop $DOCKER_CONTAINER_NAME
    docker rm $DOCKER_CONTAINER_NAME
    docker rmi $DOCKER_IMAGE

    docker pull $DOCKER_IMAGE
    docker run -d -p 3000:80 --name $DOCKER_CONTAINER_NAME $DOCKER_IMAGE"




