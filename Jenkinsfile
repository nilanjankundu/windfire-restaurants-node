pipeline {
  agent any
 
  tools {nodejs "node"}
 
  stages {

    stage('Example') {
      steps {
        sh 'npm config ls'
      }
    }

    stage('Compilation Check') {
            steps {
                echo '### Checking for compile errors ###'
                // sh '''
                //        cd ${APP_NAME}
                //        mvn -s settings.xml -B clean compile
                //   '''
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo '### Running unit tests ###'
                //sh '''
                //        cd ${APP_NAME}
                //        mvn -s settings.xml -B clean test
                //   '''
            }
        }
  }
}