source ../../setenv.sh
# ##### Variable section - START
SCRIPT=create-serviceaccount.sh
OPENSHIFT_PROJECT=
IMAGE_REGISTRY_OPTION=
IMAGE_REGISTRY=
IMAGE_REGISTRY_USERNAME=
IMAGE_REGISTRY_PASSWORD=
IMAGE_REGISTRY_SECRET=
GITHUB_SECRET=
PIPELINE_SERVICEACCOUNT=pipeline
# ##### Variable section - END
# ***** Function section - START
setOpenshiftProject()
{
    echo ${cyn}Setting up $OPENSHIFT_PROJECT OpenShift Project ...${end}
    oc new-project $OPENSHIFT_PROJECT
    oc project $OPENSHIFT_PROJECT
    echo ${cyn}OpenShift Project set${end}
    echo
}

printSelectImageRegistry()
{
	echo ${grn}Select Image Registry :${end}
    echo "${grn}1. Quay${end}"
    echo "${grn}2. Docker${end}"
	read IMAGE_REGISTRY_OPTION
	selectImageRegistry
}

selectImageRegistry()
{
	case $IMAGE_REGISTRY_OPTION in
		1)  IMAGE_REGISTRY="quay.io"
			;;
        2)  IMAGE_REGISTRY="docker.io"
            ;;
		*) 	printf "\n${red}No valid option selected${end}\n"
			printSelectImageRegistry
			;;
	esac
}

createImageRegistrySecret()
{
    echo ${cyn}Creating $IMAGE_REGISTRY_SECRET Image Registry Secret ...${end}
	oc project $OPENSHIFT_PROJECT
    oc create secret docker-registry $IMAGE_REGISTRY_SECRET \
                    --docker-server=$IMAGE_REGISTRY \
                    --docker-username=$IMAGE_REGISTRY_USERNAME \
                    --docker-password=$IMAGE_REGISTRY_PASSWORD
    echo ${cyn}Image Registry Secret created${end}
    oc annotate secret $IMAGE_REGISTRY_SECRET "tekton.dev/docker-0=quay.io"
    echo
}

createGitHubSecret()
{
    source ./create-github-secret.sh $OPENSHIFT_PROJECT $GITHUB_SECRET
}

setServiceAccount()
{
    echo ${cyn}Creating and configuring $PIPELINE_SERVICEACCOUNT Service Account ...${end}
	oc project $OPENSHIFT_PROJECT
    oc create serviceaccount $PIPELINE_SERVICEACCOUNT
    oc adm policy add-scc-to-user privileged -z $PIPELINE_SERVICEACCOUNT
    oc adm policy add-role-to-user edit -z $PIPELINE_SERVICEACCOUNT
    ### Link GitHub Secret to $PIPELINE_SERVICEACCOUNT 
    oc secrets link $PIPELINE_SERVICEACCOUNT $GITHUB_SECRET
    ### Link Image Registry Secret to $PIPELINE_SERVICEACCOUNT 
    oc secrets link $PIPELINE_SERVICEACCOUNT $IMAGE_REGISTRY_SECRET
    ### Link Image Registry Secret to default ServiceAccount
    oc secrets link default $IMAGE_REGISTRY_SECRET --for pull
    echo ${cyn}Service Account created${end}
}

inputParameters()
{
    ## Setup OpenShift Project
	echo ${grn}Enter OpenShift project - leaving blank will set project to ${end}${mag}windfire : ${end}
	read OPENSHIFT_PROJECT
    if [ "$OPENSHIFT_PROJECT" == "" ]; then
        OPENSHIFT_PROJECT=windfire
    fi
    setOpenshiftProject
    ## Select Image Registry
    printSelectImageRegistry
    ## Create Image Registry Secret
    echo ${grn}Enter Secret Name for Image Registry - leaving blank will set secret name to ${end}${mag}robipozzi-quay : ${end}
    read IMAGE_REGISTRY_SECRET
    if [ "$IMAGE_REGISTRY_SECRET" == "" ]; then
        IMAGE_REGISTRY_SECRET=robipozzi-quay
    fi
    echo ${grn}Enter Username for Image Registry : ${end}
    read IMAGE_REGISTRY_USERNAME
    echo ${grn}Enter Password for Image Registry : ${end}
    read -s IMAGE_REGISTRY_PASSWORD
    createImageRegistrySecret
    ## Create GitHub Secret
    echo ${grn}Enter Secret Name for GitHub - leaving blank will set secret name to ${end}${mag}robipozzi-github : ${end}
    read GITHUB_SECRET
    if [ "$GITHUB_SECRET" == "" ]; then
        GITHUB_SECRET=robipozzi-github
    fi
    createGitHubSecret
    ## Create and configure Service Account
    setServiceAccount
}
# ***** Function section - END

# ##############################################
# #################### MAIN ####################
# ##############################################
inputParameters