source setenv.sh

# ##### START - Variable section
RUN_FUNCTION=
OPENSHIFT_PROJECT=
APP_LABEL=
# ##### END - Variable section

# ***** START - Function section
deploy()
{
    echo ${red}***************** TODO *****************${end}
    OPENSHIFT_PROJECT=windfire
    APP_LABEL=windfire-restaurants-backend
    oc new-project $OPENSHIFT_PROJECT
    oc project $OPENSHIFT_PROJECT
    oc new-app -f $PWD/deployment/openshift/template.yaml
    #oc new-app --name $APP_LABEL https://github.com/robipozzi/windfire-restaurants-node --context-dir=app
    #oc patch svc windfire-restaurants-backend --type=json -p '[{"op": "replace", "path": "/spec/ports/0/targetPort", "value":8082}]'
    #oc expose svc $APP_LABEL
    oc get route
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
RUN_FUNCTION=deploy
$RUN_FUNCTION