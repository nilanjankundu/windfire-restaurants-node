source ./setenv.sh

# ***** START - Function section
undeploy()
{
    oc project $OPENSHIFT_PROJECT $TEST
    oc delete all -l app=$OPENSHIFT_APP_LABEL
}
# ***** END - Function section

inputParameters()
{
    ## Input OpenShift Project
	echo ${grn}Enter OpenShift project where application artifacts will be undeployed from, skipping will set to ${end}${mag}windfire : ${end}
	read OPENSHIFT_PROJECT
    if [ "$OPENSHIFT_PROJECT" == "" ]; then
        OPENSHIFT_PROJECT=windfire
    fi
    undeploy
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
inputParameters