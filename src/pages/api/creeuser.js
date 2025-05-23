import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { db } from "../../../firebase/Auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { displayName, email, password } = req.body;

    try {
      // Création de l'utilisateur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Mise à jour du profil avec le nom affiché
      await updateProfile(user, {
        displayName: displayName,
      });

      // Enregistrement dans Firestore
      await db.collection("user").doc(user.uid).set({
        displayName: displayName,
        email: email,
        created: new Date(),
      });

      res.status(200).json({ message: "Inscription réussie" });
    } catch (error) {
      console.error("Erreur d'inscription:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
