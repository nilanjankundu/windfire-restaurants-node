# Windfire Restaurants Backend (Node.js version)
This repository holds the code for the backend microservice of my *Windfire Restaurants* management application, along with scripts, playbooks and configurations to automate application run and deployment to target infrastructures.

It is a simple web application, running on Node.Js, that serves a basic Hello World html page and exposes 2 REST endpoints:
* */healthz* endpoint - it returns a string, testing that the application is up and healthy
* */restaurants* endpoint - it returns a list of restaurants in Json format

## Prerequisites
To run the demo scenarios, the following software needs to be installed:
* *Node.js* - installation instructions are available for different platforms at *https://nodejs.org/en/download/*. The application has been developed and tested with Node.js v8.11.3.
* *npm* - Node.js Package Manager is distributed with Node.js, which means that when you download Node.js, you automatically get npm installed on your computer. The application has been developed and tested with npm v5.6.0.

## Application code
Application code is provided in */app* subfolder and can be run by launching *app-run.sh* script, available in the repository root folder.