source ../../../setenv.sh

# ##### START - Variable section
RUN_FUNCTION=
# ##### END - Variable section

# ***** START - Function section
createBuildConfig()
{
    oc new-project $OPENSHIFT_PROJECT
    oc project $OPENSHIFT_PROJECT
    oc create -f $PWD/buildconfig.yaml
    oc set triggers bc/$OPENSHIFT_JENKINS_BUILDCONFIG --from-github
}

inputParameters()
{
    ## Input OpenShift Project
	echo ${grn}Enter OpenShift project where application artifacts will be deployed, skipping will set to ${end}${mag}windfire : ${end}
	read OPENSHIFT_PROJECT
    if [ "$OPENSHIFT_PROJECT" == "" ]; then
        OPENSHIFT_PROJECT=windfire
    fi
    createBuildConfig
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
inputParameters