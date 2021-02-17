# Windfire Restaurants Backend (Node.js version)
- [Overview](#overview)
- [Before you start](#before-you-start)
- [Run microservice on local](#run-microservice-on-local)
- [Target architectures and deployment automation](#target-architectures-and-deployment-automation)
  - [Raspberry deployment architecture](#raspberry-deployment-architecture)
  - [AWS architecture](#aws-architecture)
  - [OpenShift architecture](#openshift-architecture)
    - [Jenkins pipeline](#jenkins-pipeline)
    - [OpenShift pipeline](#openshift-pipeline)

## Overview
This repository containes the code for the backend microservice of my *Windfire Restaurants* application, along with scripts, playbooks and configurations to automate application run and deployment to target infrastructures.

It is a simple microservice, running on Node.js, that serves a basic Hello World html page and exposes 2 REST endpoints:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format

## Before you start
Ensure all the prerequisite software is installed:
* *Node.js* - installation instructions are available for different platforms at *https://nodejs.org/en/download/*. The application has been developed and tested with Node.js v12.14.1.
* *npm* - Node.js Package Manager is distributed with Node.js, which means that when you download Node.js, you automatically get npm installed on your computer. The application has been developed and tested with npm v6.13.4.

Before starting to use and test this microservice you also need to create **config.properties** file in *app/config* folder and fill it with appropriate parameters value for the desired environment. A placeholder config properties file, named [config_PLACEHOLDER.properties](app/config/config_PLACEHOLDER.properties) is stored in this repository for convenience.

## Run microservice on local
This microservice can be run by simply launching **app-run.sh** script, available in the */app* repository sub-folder.

## Target architectures and deployment automation
The **deploy.sh** and **undeploy.sh** scripts are provided to run deployment/undeployment automation tasks, as it can be seen in the figure below. 

![](images/deploy.png)

The scripts currently expose 4 deployment/undeployment options:
* *Raspberry* : it automates *Windfire Restaurants Backend* microservice deployment/undeployment in a Raspberry Pi target architecture;
* *AWS Single Zone* : it automates *Windfire Restaurants Backend* microservice deployment to an AWS architecture with publicly accessible Frontend and Backend subnets in a single availability zone
* *AWS Multi Zone* : it automates *Windfire Restaurants Backend* microservice deployment to an AWS architecture with Frontend and Backend subnets in a variable number of availability zones to create a Fault Tolerant architecture
* *OpenShift* : it automates *Windfire Restaurants Backend* microservice deployment to an OpenShift cluster


### Raspberry deployment architecture
Automation is implemented using Ansible technology (https://www.ansible.com/): refer to Ansible technical documentation (https://docs.ansible.com/) for detailed instructions regarding installation and setup.

A file, named **ansible.cfg**, is provided to set basic configurations needed to run Ansible: the **deploy.sh** and **undeploy.sh** scripts set ANSIBLE_CONFIG environment variable pointing to this file; the basic configuration you should have is something like this:

![](images/ansible-config.png)
where:

* *inventory* defines where Ansible will look for the inventory file, which is used by Ansible to know which servers to connect and manage;
* *private_key_file* points to the SSH private key used by Ansible to connect and launch tasks on the target infrastructure.

Change the parameters according to your environment.

The scripts wrap Ansible to automate deployment tasks, using the Ansible provided playbook [deployment/raspberry/deploy.yaml](deployment/raspberry/deploy.yaml) for deployment and the Ansible provided playbook [deployment/raspberry/remove.yaml](deployment/raspberry/remove.yaml) for microservice undeployment.


### AWS architecture
AWS target deployment environment is based on the following Architecture

![](images/AWS-robipozzi_windfire-restaurants.png)

*Windfire Restaurant Backend* microservice is deployed to an EC2 instance placed in the Backend subnet. 

For security reasons, either the Frontend and Backend subnets are not directly accessible via SSH. Ansible automation script is configured to connect to the target hosts via a Bastion Host, conveniently placed in the Management subnet.

In case of deployment to AWS, since the Cloud architecture is more dynamic by nature, the **deploy.sh** and **undeploy.sh** scripts delegate to [deployment/aws/ansible-config.sh](deployment/aws/ansible-config.sh) script the dynamic definition of 2 files that are used by Ansible:

* *ansible-aws.cfg*, which dynamically sets Ansible configuration. An example of such a configuration is reported in the following figure

![](images/ansible-aws.cfg.png)

* *ansible-ssh.cfg*, which sets SSH configurations to allow Ansible to connect to Frontend and Backend instances, through the Bastion Host. An example of such a configuration is reported in the following figure

![](images/ansible-ssh.png)

The scripts wrap Ansible to automate deployment tasks, using the Ansible provided playbook [deployment/aws/deploy.yaml](deployment/aws/deploy.yaml) for deployment and the Ansible provided playbook [deployment/aws/remove.yaml](deployment/aws/remove.yaml) for microservice undeployment.


### OpenShift architecture
In case of deployment to OpenShift, **deploy.sh** delegates to [deployment/openshift/deploy.sh](deployment/openshift/deploy.sh) script, which then runs an **oc new-app** command using [deployment/openshift/windfire-restaurants-backend-template.yaml](deployment/openshift/windfire-restaurants-backend-template.yaml) OpenShift Template; the template defines and creates all the following objects:

* *ImageStream* that references the container image in OpenShift Internal Registry
* *BuildConfig* of type Git that uses *nodejs:10-SCL* Source-to-Build image to build from source code
* *DeploymentConfig* that defines how the application is deployed to OpenShift cluster
* *Service* of type ClusterIP that exposes required ports and allows to interact with the running pods from within the OpenShift cluster
* *Route* that exposes the Service outside the OpenShift cluster

#### Jenkins pipeline
A BuildConfig definition of type JenkinsPipeline is also available at [deployment/openshift/jenkins/buildconfig.yaml](deployment/openshift/jenkins/buildconfig.yaml) to allow using Jenkins to automate build and deployment to OpenShift; the BuildConfig then delegates the build and deployment steps to [Jenkinsfile](Jenkinsfile)

#### OpenShift pipeline
An implementation of build and deployment procedure with OpenShift Pipelines (based on Tekton) is ongoing and will be delivered soon.

[TODO]