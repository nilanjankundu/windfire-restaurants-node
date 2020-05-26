source setenv.sh

HOST=$(oc get route default-route -n openshift-image-registry --template='{{ .spec.host }}')
echo $HOST

echo ${cyn}Pushing Docker image to OpenShift Internal Registry...${end}
docker tag $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION $HOST/windfire/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION
docker push $HOST/windfire/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION
echo ${cyn}Docker image pushed${end}
echo
echo ${cyn}Removing tagged Docker image ...${end}
docker rmi -f $HOST/windfire/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION
echo ${cyn}Tagged Docker image removed${end}