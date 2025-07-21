
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## GitHub Actions Deployment

This project is configured to automatically deploy a preview version to Firebase Hosting when you create a pull request.

### Required Secret

To enable this, you need to add a secret to your GitHub repository settings:

1.  **Name:** `FIREBASE_SERVICE_ACCOUNT_WAPPSENDER_PRO`
2.  **Value:** The JSON content of your Firebase service account key.

You can generate a new service account key from your **Firebase Project Settings > Service accounts**.
