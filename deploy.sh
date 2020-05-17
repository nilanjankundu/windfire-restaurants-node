source app/setenv.sh

# ##### START - Variable section
SCRIPT=deploy.sh
PLATFORM_OPTION=$1
AWS_ACCESS_KEY=$2
AWS_SECRET_KEY=$3
DEPLOY_FUNCTION=
# ##### END - Variable section

# ***** START - Function section
deployToRaspberry()
{
	## Deploy Node.js application to remote Raspberry box
    echo ${cyn}Deploy application to Raspberry Pi ...${end}
    export ANSIBLE_CONFIG=$PWD/deployment/raspberry/ansible.cfg
    ansible-playbook deployment/raspberry/deploy.yaml 
    echo ${cyn}Done${end}
    echo
}

deployToAWS()
{
    printInsertAWS_KEY
    printInsertAWS_SECRET
    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY
    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY
	## Deploy Node.js application to AWS
    echo ${cyn}Deploy application to AWS ...${end}
    ANSIBLE_CONFIG_FILE=ansible-aws.cfg
    echo ${cyn}Invoking ansible-config.sh to dynamically create configuration files for Ansible ...${end}
    deployment/aws/ansible-config.sh $ANSIBLE_CONFIG_FILE
    export ANSIBLE_CONFIG=$PWD/deployment/aws/$ANSIBLE_CONFIG_FILE
    echo
    ansible-playbook -i deployment/aws/windfire.aws_ec2.yaml deployment/aws/deploy.yaml
    echo ${cyn}Done${end}
    echo
}

deploy()
{
    rm -rf $PWD/app/node_modules
    if [ -z $PLATFORM_OPTION ]; then 
        printSelectPlatform
    fi
    $DEPLOY_FUNCTION
}

printInsertAWS_KEY()
{
	echo ${grn}Insert AWS Key : ${end}
	read AWS_ACCESS_KEY
}

printInsertAWS_SECRET()
{
	echo ${grn}Insert AWS Secret : ${end}
	read AWS_SECRET_KEY
}

printSelectPlatform()
{
	echo ${grn}Select deployment platform : ${end}
    echo "${grn}1. Raspberry${end}"
    echo "${grn}2. AWS Single Zone${end}"
    echo "${grn}3. AWS Multi Zone${end}"
	read PLATFORM_OPTION
	setDeployFunction
}

setDeployFunction()
{
	case $PLATFORM_OPTION in
		1)  DEPLOY_FUNCTION="deployToRaspberry"
			;;
        2)  DEPLOY_FUNCTION="deployToAWS"
            ;;
		*) 	printf "\n${red}No valid option selected${end}\n"
			printSelectPlatform
			;;
	esac
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
# ************ START evaluate args ************"
if [ "$1" != "" ]; then
    setDeployFunction
fi
# ************** END evaluate args **************"
RUN_FUNCTION=deploy
$RUN_FUNCTION