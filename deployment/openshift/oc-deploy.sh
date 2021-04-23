source ./setenv.sh
# ***** Function section - START
deploy()
{
    oc new-project $OPENSHIFT_PROJECT
    oc project $OPENSHIFT_PROJECT
    BASE_DOMAIN=$(oc get DNS cluster -o jsonpath='{.spec.baseDomain}')
    echo OpenShift cluster domain is ${grn}$BASE_DOMAIN${end}
    oc new-app -f $PWD/deployment/openshift/windfire-restaurants-backend-template.yaml -p OPENSHIFT_PROJECT=$OPENSHIFT_PROJECT -p OPENSHIFT_CLUSTER_DOMAIN=$BASE_DOMAIN -p OPENSHIFT_GITHUB_SECRET=$GITHUB_SECRET
    #oc patch svc OPENSHIFT_APP_LABEL --type=json -p '[{"op": "replace", "path": "/spec/ports/0/targetPort", "value":8082}]'
    ROUTE_URL=$(oc get route windfire-restaurants-backend -o jsonpath='{.spec.host}')
    echo Test it at ${grn}$ROUTE_URL${end}
}

inputParameters()
{
    ## Input OpenShift Project
	echo ${grn}Enter OpenShift project where application artifacts will be deployed, skipping will set to ${end}${mag}windfire : ${end}
	read OPENSHIFT_PROJECT
    if [ "$OPENSHIFT_PROJECT" == "" ]; then
        OPENSHIFT_PROJECT=windfire
    fi
    ###### Input GitHub Secret
    echo ${grn}Enter Secret Name for GitHub - leaving blank will set secret name to ${end}${mag}robipozzi-github : ${end}
    read GITHUB_SECRET
    if [ "$GITHUB_SECRET" == "" ]; then
        GITHUB_SECRET=robipozzi-github
    fi
    deploy
}
# ***** Function section - END

# ##############################################
# #################### MAIN ####################
# ##############################################
inputParameters