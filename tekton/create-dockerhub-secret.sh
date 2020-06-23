source ../setenv.sh
# ##### START - Variable section
DOCKERHUB_USERNAME=
DOCKERHUB_PASSWORD=
# ##### END - Variable section

# ***** START - Function section
createSecret()
{
    oc project windfire
    kubectl create secret docker-registry dockerhub-secret \
                    --docker-server=https://index.docker.io/v1/ \
                    --docker-username=$DOCKERHUB_USERNAME \
                    --docker-password=$DOCKERHUB_PASSWORD \
                    #--docker-email=r.robipozzi@gmail.com
	# kubectl create secret docker-registry dockerhub-secret \
    #                 --docker-server=https://index.docker.io/v1/ \
    #                 --docker-username=robipozzi \
    #                 --docker-password=Heron72a \
    #                 --docker-email=r.robipozzi@gmail.com
}

main()
{
	echo ${grn}Input your Docker Hub username : ${end}
    read DOCKERHUB_USERNAME
    echo ${grn}Input your Docker Hub password : ${end}
    read -s DOCKERHUB_PASSWORD
	createSecret
}
# ***** END - Function section

main