const admin = require("firebase-admin");
// const serviceAccount = require("../config/boutique-30a46-firebase-adminsdk-fbsvc-deee5d2509.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
