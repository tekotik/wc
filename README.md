
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying to Vercel

When deploying this project to Vercel, you need to set up several environment variables for authentication and Firebase connection to work correctly.

### 1. `SESSION_SECRET`

This is used for encrypting user sessions.

1.  **Find your `SESSION_SECRET`**: Open the `.env` file in the root of your project. You will find a line like `SESSION_SECRET=...`.
2.  **Copy the secret value**: Copy the long string of characters after the equals sign.
3.  **Add to Vercel**:
    *   Go to your project on Vercel.
    *   Navigate to **Settings > Environment Variables**.
    *   Create a new variable with the **Name** `SESSION_SECRET` and paste the copied string into the **Value** field.

### 2. Firebase Configuration

You need to connect this project to a Firebase project to handle user data.

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Create a Web App**: Inside your new project, click the `</>` icon to create a new Web Application. Register the app.
3.  **Get Firebase Config**: After registering, Firebase will show you a `firebaseConfig` object. It will look like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };
    ```
4.  **Enable Firestore**: In the Firebase Console, go to **Firestore Database** from the left menu and create a new database. Start in **test mode** for now.
5.  **Add Firebase Variables to Vercel**: Go back to your Vercel project's **Environment Variables** settings and add the following variables, copying the values from your `firebaseConfig` object:
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `NEXT_PUBLIC_FIREBASE_APP_ID`

6.  **Redeploy**: Go to the **Deployments** tab and redeploy your latest deployment to apply the changes.

## GitHub Actions Deployment

This project is configured to automatically deploy a preview version to Firebase Hosting when you create a pull request.

### Required Secret

To enable this, you need to add a secret to your GitHub repository settings:

1.  **Name:** `FIREBASE_SERVICE_ACCOUNT_WAPPSENDER_PRO`
2.  **Value:** The JSON content of your Firebase service account key.

You can generate a new service account key from your **Firebase Project Settings > Service accounts**.
