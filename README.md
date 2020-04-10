# Introduction

This is node.js project which shows the integration of several frameworks together to create a complete node.js app.

## Tools/Features Used

-   Typescript
-   Docker
    -   Multistage Build Dockerfile (including production, development and testing images)
    -   Uses the aquasec microscanner to scan for image vulnerabilites during building the image. See the following link to read more about aquasec ![Aquasec Microscanner](https://github.com/aquasecurity/microscanner)

## Versions

This repo demonstrates two versions of the same running application. The first version (v1.0.3) has **Zero Production Dependencies** whereas the next version (v1.0.4) has a production dependency for the _Reflection Metadata_ package. The _Reflection Metadata_ package is used as a polyfill for the experimental proposed Javascript reflection API.

## Building the Docker Image

There are two ways with which you can run (and develop) this app, which is with and without docker. Several NPM scripts have been provided for convenience when working with docker (instead of trying to remember long CLI lines).

**Build the Docker Image**
The docker image is built using a **multistage** build dockerfile. There are six stages which is base, dev, test, scan, pre-prod and production.

Before building the docker image, get your own microscanner token at ![Microscanner Signup](https://microscanner.aquasec.com/signup) and export it as an environment variable with the name MICROSCANNER_TOKEN. If you do not have a MICROSCANNER_TOKEN setup in your environment variable, the build will skip the scan step and output the microscanner command (but should continue building without problems).

The dockerized version of the npm scripts have a ":docker" postfix, so instead of npm run start, you would run npm run start:docker.

To start the build process, run the following command :

```shell
npm run build:docker
```

This will build all the stages in the multistage dockerfile. To start the server, run npm start:docker from the command line.

```shell
npm run start:docker
```

The npm run dev:docker command provides convenience in that it uses docker bind-mounts to synchronize your host filesystem with that of the container's. What this means is that the nodemon process in the container will watch for file changes on your host system (where you develop, change and save files) and will automatically

# CI/CD Pipeline

# Google Kubernetes Engine

# GCP Monitoring and Logging

You can access the service at...

https://cloud.google.com/monitoring/kubernetes-engine/observing
