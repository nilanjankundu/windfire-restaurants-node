pipeline {
    options {
        // set a timeout of 60 minutes for this pipeline
        timeout(time: 60, unit: 'MINUTES')
    }
    
    agent {
      node {
        label 'nodejs'
      }
    }

    environment {
        APP_NAME = "windfire-restaurants-backend"
        DEV_PROJECT = "windfire"
        STAGE_PROJECT = "windfire-stage"
        PROD_PROJECT = "windfire-prod"
        APP_GIT_URL = "https://github.com/robipozzi/windfire-restaurants-node"
    }

    stages {
        stage('Deploy to DEV environment') {
            steps {
                sh '''
                        echo Current dir is $PWD
                        ls -la
                        oc project $DEV_PROJECT
                   '''
                echo '### Cleaning existing resources in DEV env ###'
                /*sh '''
                        oc delete all -l app=${APP_NAME} -n ${DEV_PROJECT}
                        oc delete all -l build=${APP_NAME} -n ${DEV_PROJECT}
                        echo sleep 5
                        echo oc new-build java:8 --name=${APP_NAME} --binary=true -n ${DEV_PROJECT}
                   '''*/

                echo '### Creating a new app in DEV env ###'
                sh '''
                        TEST=$(oc get bc/windfire-restaurants-backend -o jsonpath='{.metadata.name}')
                        echo $TEST
                        
                   '''
                /*script {
                    openshift.withCluster() {
                      openshift.withProject(env.DEV_PROJECT) {
                        openshift.selector("bc", "${APP_NAME}").startBuild("--from-file=${APP_NAME}/target/${APP_NAME}.jar", "--wait=true", "--follow=true")
                      }
                    }
                }*/
                // TODO: Create a new OpenShift application based on the ${APP_NAME}:latest image stream
                // TODO: Expose the ${APP_NAME} service for external access
            }
        }
    }
}