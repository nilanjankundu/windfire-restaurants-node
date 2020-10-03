# ##### START - Variable section
RUN_FUNCTION=
# ##### END - Variable section

# ***** START - Function section
deploy()
{
    echo "***************** TODO *****************"
    oc new-app --name windfire-restaurants-backend https://github.com/robipozzi/windfire-restaurants-node -o yaml
}
# ***** END - Function section

# ##############################################
# #################### MAIN ####################
# ##############################################
RUN_FUNCTION=deploy
$RUN_FUNCTION