import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "veillez remplir le champ !" });
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        res.status(200).json({
          message: `Nous avons envoyer un e-mail à ${email} avec un lien permettant de réinitialiser votre mot de passe.`,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Impossible de changer votre mot de passe / ou utilisateur existe pas!",
        });
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);

        // ..
      });
  }
}
