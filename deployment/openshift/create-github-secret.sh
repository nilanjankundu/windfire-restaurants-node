source ../../setenv.sh
# ##### Variable section - START
SCRIPT=create-github-secret.sh
OPENSHIFT_PROJECT=$1
GITHUB_SECRET=$2
GITHUB_USERNAME=
GITHUB_ACCESS_TOKEN=
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

createGitHubSecret()
{
    echo ${cyn}Creating $GITHUB_SECRET GitHub Secret ...${end}
	oc project $OPENSHIFT_PROJECT
    oc create secret generic $GITHUB_SECRET \
        --from-literal=username=$GITHUB_USERNAME \
        --from-literal=password=$GITHUB_ACCESS_TOKEN \
        --type=kubernetes.io/basic-auth
    echo ${cyn}GitHub Secret created${end}
    oc annotate secret $GITHUB_SECRET "tekton.dev/git-0=https://github.com"
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

inputGitHubSecret()
{
    ###### Setup GitHub Secret
    if [ "$GITHUB_SECRET" != "" ]; then
        echo GitHub Secret is set to $GITHUB_SECRET
    else
        echo ${grn}Enter Secret Name for GitHub - leaving blank will set secret name to ${end}${mag}robipozzi-github : ${end}
        read GITHUB_SECRET
        if [ "$GITHUB_SECRET" == "" ]; then
            GITHUB_SECRET=robipozzi-github
        fi
    fi
    echo ${grn}Enter GitHub Username : ${end}
        read GITHUB_USERNAME
        echo ${grn}Enter GitHub Personal Access Token : ${end}
        read -s GITHUB_ACCESS_TOKEN
    createGitHubSecret
}

main()
{
    inputOpenshiftProject
    inputGitHubSecret
}
# ***** Function section - END

# ##############################################
# #################### MAIN ####################
# ##############################################
main