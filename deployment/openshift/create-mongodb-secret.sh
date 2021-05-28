source ./setenv.sh
# ##### Variable section - START
SCRIPT=create-mongodb-secret.sh
OPENSHIFT_PROJECT=$1
MONGODB_SECRET=$2
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

createMongoDbSecret()
{
    echo ${cyn}Creating $MONGODB_SECRET Secret ...${end}
	oc project $OPENSHIFT_PROJECT
    oc create secret generic $MONGODB_SECRET --from-literal=PASSWORD=$MONGODB_PASSWORD
    echo ${cyn}$MONGODB_SECRET Secret created${end}
    echo
}

inputOpenshiftProject()
{
    ###### Setup OpenShift Project
    if [ "$OPENSHIFT_PROJECT" != "" ]; then
        echo OpenShift project is set to $OPENSHIFT_PROJECT
    else
        echo ${grn}Enter OpenShift project - leaving blank will set project to ${end}${mag}windfire : ${end}
        read OPENSHIFT_PROJECT
        if [ "$OPENSHIFT_PROJECT" == "" ]; then
            OPENSHIFT_PROJECT=windfire
        fi
    fi
    setOpenshiftProject
}

inputMongoDbSecret()
{
    ###### Setup MongoDb Secret
    if [ "$MONGODB_SECRET" != "" ]; then
        echo MongoDb Secret name is set to $MONGODB_SECRET
    else
        echo ${grn}Enter Secret Name for MongoDb - leaving blank will set secret name to ${end}${mag}mongodb-secret : ${end}
        read MONGODB_SECRET
        if [ "$MONGODB_SECRET" == "" ]; then
            MONGODB_SECRET=mongodb-secret
        fi
    fi
    echo ${cyn}Checking if $MONGODB_SECRET Secret already exists in $OPENSHIFT_PROJECT OpenShift Project ...${end}
    SECRET=$(oc get secret $MONGODB_SECRET -o jsonpath='{.metadata.name}')
    if [ "$SECRET" != "" ]; then
        echo ${cyn}$MONGODB_SECRET${end} Secret already exists
    else
        echo Create $MONGODB_SECRET Secret
        echo ${grn}Enter MongoDb password : ${end}
        read -s MONGODB_PASSWORD
        createMongoDbSecret
    fi
}

main()
{
    inputOpenshiftProject
    inputMongoDbSecret
}
# ***** Function section - END

# ##############################################
# #################### MAIN ####################
# ##############################################
main