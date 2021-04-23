# Windfire Restaurants Backend (Node.js version)
- [Overview](#overview)
- [Before you start](#before-you-start)
- [Run microservice on local](#run-microservice-on-local)
- [Target architectures and deployment automation](#target-architectures-and-deployment-automation)
  - [Raspberry deployment](#raspberry-deployment)
  - [AWS deployment](#aws-deployment)
  - [OpenShift deployment](#openshift-deployment)
    - [OpenShift Template](#openshift-template)
    - [OpenShift pipeline](#openshift-pipeline)
    - [Jenkins pipeline](#jenkins-pipeline)

## Overview
This repository contains the code for the backend microservice of my *Windfire Restaurants* application, along with scripts, playbooks and configurations to automate application run and deployment to target infrastructures.

It is a simple microservice, running on Node.js, that serves a basic Welcome html page and exposes 2 REST endpoints:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format

## Before you start
Ensure all the prerequisite software is installed:
* *Node.js* - installation instructions are available for different platforms at *https://nodejs.org/en/download/*. The application has been developed and tested with Node.js v12.14.1.
* *npm* - Node.js Package Manager is distributed with Node.js, which means that when you download Node.js, you automatically get npm installed on your computer. The application has been developed and tested with npm v6.13.4.

Before starting to use and test this microservice you also need to create a **config.properties** file in *app/config* folder and fill it with appropriate parameter values for the desired environment. A placeholder config properties file, named [config_PLACEHOLDER.properties](app/config/config_PLACEHOLDER.properties) is stored in this repository for convenience.

## Run microservice on local
This microservice can be run locally by simply launching **[app-run.sh](app/app-run.sh)** script, available in the */app* folder.

## Target architectures and deployment automation
*Windfire Restaurants Backend* microservice can be deployed to different kind of infrastructures; automation procedures are provided in this repository for Raspberry, AWS and Red Hat OpenShift.

**WARNING: OpenShift pre-requisites**: in case of deployment to Red Hat OpenShift, you firstly need to configure Service Accounts for build and deployment appropriately, following [these instructions](#openshift-architecture).

The **[deploy.sh](deploy.sh)** and **[undeploy.sh](undeploy.sh)** scripts are provided to run deployment/undeployment automation tasks, as it can be seen in the figure below. 

![](images/deploy.png)

The scripts currently expose 5 deployment/undeployment options:
* *Raspberry* : it automates *Windfire Restaurants Backend* microservice deployment/undeployment in a Raspberry Pi target architecture;
* *AWS Single Zone* : it automates *Windfire Restaurants Backend* microservice deployment to an AWS architecture with publicly accessible Frontend and Backend subnets in a single availability zone
* *AWS Multi Zone* : it automates *Windfire Restaurants Backend* microservice deployment to an AWS architecture with Frontend and Backend subnets in a variable number of availability zones to create a Fault Tolerant architecture
* *OpenShift (using Template)* : it automates *Windfire Restaurants Backend* microservice deployment to an OpenShift cluster, using a Template
* *OpenShift (using OpenShift Pipeline)* : it automates *Windfire Restaurants Backend* microservice deployment to an OpenShift cluster, running an OpenShift Pipeline. 

Another deployment automation strategy is also available, based on Jenkins, details on how to implement and use it are in [Jenkins pipeline](#jenkins-pipeline) paragraph.

### Raspberry deployment
Automation is implemented using Ansible technology (https://www.ansible.com/): refer to Ansible technical documentation (https://docs.ansible.com/) for detailed instructions regarding installation and setup.

A file, named **[ansible.cfg](deployment/raspberry/ansible.cfg)**, is provided in *deployment/raspberry* folder to set basic configurations needed to run Ansible: **[deploy.sh](deploy.sh)** and **[undeploy.sh](undeploy.sh)** scripts set ANSIBLE_CONFIG environment variable pointing to this file; the basic configuration you should have is something like this:

![](images/ansible-config.png)
where:

* *inventory* defines where Ansible will look for the inventory file, which is used by Ansible to know which servers to connect and manage;
* *private_key_file* points to the SSH private key used by Ansible to connect and launch tasks on the target infrastructure.

Change the parameters according to your environment.

The scripts wrap Ansible to automate deployment tasks, using the Ansible provided playbook **[deploy.yaml](deployment/raspberry/deploy.yaml)** for deployment and the Ansible provided playbook **[remove.yaml](deployment/raspberry/remove.yaml)** for microservice undeployment.

### AWS deployment
AWS target deployment environment is based on the following Architecture

![](images/AWS-robipozzi_windfire-restaurants.png)

*Windfire Restaurant Backend* microservice is deployed to an EC2 instance placed in the Backend subnet. 

For security reasons, either the Frontend and Backend subnets are not directly accessible via SSH. Ansible automation script is configured to connect to the target hosts via a Bastion Host, conveniently placed in the Management subnet.

In case of deployment to AWS, since the Cloud architecture is more dynamic by nature, the **[deploy.sh](deploy.sh)** and **[undeploy.sh](undeploy.sh)** scripts delegate to **[ansible-config.sh](deployment/aws/ansible-config.sh)** script in *deployment/aws* folder the dynamic definition of 2 files that are used by Ansible:

* *ansible-aws.cfg*, which dynamically sets Ansible configuration. An example of such a configuration is reported in the following figure

![](images/ansible-aws.cfg.png)

* *ansible-ssh.cfg*, which sets SSH configurations to allow Ansible to connect to Frontend and Backend instances, through the Bastion Host. An example of such a configuration is reported in the following figure

![](images/ansible-ssh.png)

The scripts wrap Ansible to automate deployment tasks, using the Ansible provided playbook **[deploy.yaml](deployment/aws/deploy.yaml)** for deployment and the Ansible provided playbook **[remove.yaml](deployment/aws/remove.yaml)** for microservice undeployment.

### OpenShift deployment
[TODO]

#### OpenShift Template
Before deploying the application to OpenShift you firstly need to run **[create-github-secret.sh](deployment/openshift/create-github-secret.sh)** script, which creates a Secret that allows deployment procedures to access and clone source code repository even in case GitHub repo is private and not publicly accessible.

Once you have created the GitHub Secret, you can run **[deploy.sh](deploy.sh)** that delegates to **[oc-deploy.sh](deployment/openshift/oc-deploy.sh)** script, which then runs an **oc new-app** command using **[windfire-restaurants-backend-template.yaml](deployment/openshift/jenkins/windfire-restaurants-backend-template.yaml)** OpenShift Template; the template defines and creates all the following objects:

* *ImageStream* that references the container image in OpenShift Internal Registry
* *BuildConfig* of type Git that uses *nodejs:10-SCL* Source-to-Build image to build from source code
* *DeploymentConfig* that defines how the application is deployed to OpenShift cluster
* *Service* of type ClusterIP that exposes required ports and allows to interact with the running pods from within the OpenShift cluster
* *Route* that exposes the Service outside the OpenShift cluster

#### OpenShift pipeline

##### Before you start
Before experimenting with OpenShift Pipelines, you need to take 2 preparatory steps:
1. [Install OpenShift Pipelines](#install-openShift-pipelines) on your OpenShift cluster (pretty obvious !!!).
2. [Create a Service Account](#configure-service-account) and configure it appropriately.

##### Install OpenShift Pipelines
Go to OpenShift web console, select **Operators** -> **Operators Hub** from the navigation menu on the left of your OpenShift web console and then search for the OpenShift Pipelines Operator.

![operatorhub](./images/operatorhub.png)

Click on the tile and then the subsequent Install button.

![pipelineoperator](./images/pipelineoperator.png)

Keep the default settings on the Create Operator Subscription page and click Subscribe.

##### Configure Service Account
To make sure the pipeline has the appropriate permissions to store images in the local OpenShift registry, we need to create a service account. We'll call it **pipeline**.

Running **[create-serviceaccount.sh](create-serviceaccount.sh)** script does everything that is needed:
- it sets context to the OpenShift project selected (the project is automatically created if it does not pre-exist)
- it creates a **pipeline** Service Account
- it adds a **privileged** Security Context Constraint to pipeline account
- it adds an **edit** Role to pipeline account
- it creates a Secret for GitHub credentials, annotates with **"tekton.dev/git-0=https://github.com"** and links it to **pipeline** Service Account
- it creates a Secret for Quay credentials, annotates with **"tekton.dev/docker-0=quay.io"** and links it to **pipeline** Service Account
- it links Secret for Quay credentials to **default** Service Account for pull

#### Jenkins pipeline
To use this approach, you will firstly need to have access to a Jenkins instance and configure it appropriately; refer to my other GitHub repository https://github.com/robipozzi/devops/blob/master/Jenkins/README.md for instructions on how to setup and configure Jenkins on OpenShift itself.

A BuildConfig definition of type JenkinsPipeline is defined in **[buildconfig.yaml](deployment/openshift/jenkins/buildconfig.yaml)** to allow using Jenkins to automate build and deployment to OpenShift. 

Run **[create-buildconfig.sh](deployment/openshift/jenkins/create-buildconfig.sh)** to create the *BuildConfig* object, that can then be used to start Builds; the BuildConfig then delegates the actual build and deployment steps to this **[Jenkinsfile](Jenkinsfile)**. 