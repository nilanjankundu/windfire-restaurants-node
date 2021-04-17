source ../../../setenv.sh

# ##### START - Variable section
RUN_FUNCTION=
# ##### END - Variable section

# ***** START - Function section
deleteBuildConfig()
{
    oc project $OPENSHIFT_PROJECT
    oc delete bc $OPENSHIFT_JENKINS_BUILDCONFIG
}

inputParameters()
{
    ## Input OpenShift Project
	echo ${grn}Enter OpenShift project, skipping will set to ${end}${mag}windfire : ${end}
	read OPENSHIFT_PROJECT
    if [ "$OPENSHIFT_PROJECT" == "" ]; then
        OPENSHIFT_PROJECT=windfire
    fi
    deleteBuildConfig
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
inputParameters