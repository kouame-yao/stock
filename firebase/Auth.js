const admin = require("firebase-admin");
const serviceAccount = require("../config/boutique-30a46-firebase-adminsdk-fbsvc-deee5d2509.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
