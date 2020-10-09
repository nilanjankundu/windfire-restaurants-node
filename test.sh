echo Current directory is $PWD
ls -la
oc project windfire
APP_BUILD_CONFIG=$(oc get bc/windfire-restaurants-backend -o jsonpath='{.metadata.name}')
if [ -z $APP_BUILD_CONFIG ]; then 
    echo no BuildConfig
else
    echo BuildConfig for application is $APP_BUILD_CONFIG
fi