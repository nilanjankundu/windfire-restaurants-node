# ##### START - Variable section
RUN_FUNCTION=
OPENSHIFT_PROJECT=
APP_LABEL=
# ##### END - Variable section

# ***** START - Function section
undeploy()
{
    echo "***************** TODO *****************"
    OPENSHIFT_PROJECT=windfire
    APP_LABEL=windfire-restaurants-backend
    oc project $OPENSHIFT_PROJECT
    oc delete all -l app=$APP_LABEL
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
RUN_FUNCTION=undeploy
$RUN_FUNCTION