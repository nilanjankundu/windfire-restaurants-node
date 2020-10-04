source setenv.sh

# ##### START - Variable section
RUN_FUNCTION=
# ##### END - Variable section

# ***** START - Function section
deploy()
{
    oc new-project $OPENSHIFT_PROJECT
    oc project $OPENSHIFT_PROJECT
    oc new-app -f $PWD/deployment/openshift/windfire-restaurants-backend-template.yaml
    #oc patch svc OPENSHIFT_APP_LABEL --type=json -p '[{"op": "replace", "path": "/spec/ports/0/targetPort", "value":8082}]'
    ROUTE_URL=$(oc get route windfire-restaurants-backend -o jsonpath='{.spec.host}')
    echo Test it at ${grn}$ROUTE_URL${end}
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
RUN_FUNCTION=deploy
$RUN_FUNCTION