source ../setenv.sh
# ##### START - Variable section
DOCKER_REGISTRY_DEFAULT=https://index.docker.io/v1/
DOCKER_USERNAME=
DOCKER_PASSWORD=
# ##### END - Variable section

# ***** START - Function section
createSecret()
{
    oc project windfire
    kubectl create secret docker-registry dockerhub-secret \
                    --docker-server=$DOCKER_REGISTRY \
                    --docker-username=$DOCKER_USERNAME \
                    --docker-password=$DOCKER_PASSWORD \
                    #--docker-email=r.robipozzi@gmail.com
}

main()
{
	echo "${cyn}Input your Container Registry (default is $DOCKER_REGISTRY_DEFAULT) :${end}" 
    read DOCKER_REGISTRY
    if [$DOCKER_REGISTRY == ""]; then
        DOCKER_REGISTRY=$DOCKER_REGISTRY_DEFAULT
    fi
    echo ${cyn}Input your Docker Hub username : ${end}
    read DOCKER_USERNAME
    echo ${cyn}Input your Docker Hub password : ${end}
    read -s DOCKER_PASSWORD
	createSecret
}
# ***** END - Function section

main