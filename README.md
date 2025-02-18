# AI-Powered Insights Platform

Welcome to the AI-Powered Insights Platform, a web-based application that leverages AI to analyze and compare reports, providing valuable insights. This document provides detailed setup instructions, prerequisites, and deployment guidelines.

## PREREQUISITES

Before running the project, ensure you have the following installed:

- Node.js (v16+ recommended)

- npm (or yarn)

- Google Cloud SDK (for cloud storage and deployment)

- gcloud CLI (for managing cloud storage and bucket permissions)

- Note about input reports: Input reports has to be within 8mb file size per report. Any file that is larger than 8 MB will not be pushed.

## PROJECT SETUP

### 1. Configure Runtime Configuration

The project relies on a runtime-config.json file, which should be stored in a Google Cloud Storage bucket. Ensure that this file is publicly accessible or that your application has the necessary permissions to access it.

** runtime-config Format: ** 

```
{
  "environment": "PROD",  // Change to "DEV" for local development
  "REACT_APP_BACKEND_URL": "https://your-backend-url.com"
}
```

For Development: Set environment to DEV to use http://localhost:8000 as the backend URL.

For Production: Set environment to PROD and specify your cloud backend URL.

### 2. Update Config File

Once the runtime-config.json file is accessible, update the config.js file in the frontend to point to its location:

If you use a different bucket name, update the URL accordingly.

### 3. Create and Configure Google Cloud Storage Bucket

By default, the backend expects a bucket named rag-app-deployments_cloudbuild. If you prefer a different name, update the .env file in the Python backend:

BUCKET_NAME=my-custom-bucket-name

If you use a different bucket name, ensure that you replace it in all references throughout the project.

### 4. Set Up CORS for Cloud Storage

To enable your frontend to communicate with the Google Cloud Storage bucket, run the following command in gcloud CLI:

```
gcloud storage buckets update gs://<bucket-name> --cors-file=cors-config.json
```

Ensure your cors-config.json contains the correct settings:

```
cors-config.json

[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
```

This allows CORS for the specified methods (GET, POST, PUT, DELETE).

## FRONTEND SETUP

### 1. Install Frontend Dependencies

Navigate to the frontend directory and run:

```
npm install

```
or if using yarn:

```
yarn install
```

### 2. Start the Frontend

To start the React application locally:

```
npm run dev
```

## SECURITY

The integration with backend is supported by JWT tokens. Any fetch calls will have the associated token and if the token is not valid, then the call wouldn't receive a response. In addition to that, we are checking for valid token in authcontext every 5 mins. As soon as the token expires, the user is logged out and has to authenticate and obtain a new token.

## DEPLOYMENT

For deployment to cloud build, it is important that we set up a trigger to the frontend repo. In the cloudbuild.yaml, we will tag the image with ${SHORT_SHA} and this will be replaced with the associated value by cloud build on execution. This is done to ensure that the latest image is selected for deployment.