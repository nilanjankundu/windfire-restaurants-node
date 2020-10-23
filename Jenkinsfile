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
                echo '### Deploy to DEV environment ###'
                script {
                    openshift.withCluster() {
                        openshift.withProject("$DEV_PROJECT") {
                            echo "Using project: ${openshift.project()}"
                            if (openshift.selector("bc", APP_NAME).exists()) { 
                                echo "BuildConfig " + APP_NAME + " exists, start new build to update app ..."
                                //openshift.selector("bc", "${APP_NAME}").startBuild("--from-file=${APP_NAME}/target/${APP_NAME}.jar", "--wait=true", "--follow=true")
                                def bc = openshift.selector("bc", "${APP_NAME}")
                                bc.describe()
                            } else{
                                echo "BuildConfig " + APP_NAME + " does not exist, creating app ..."
                                openshift.newApp('deployment/openshift/windfire-restaurants-backend-template.yaml')
                            }
                        }
                    }
                }
            }
        }
    }
}