// pages/api/creeuser.js

import { auth, db } from "../../../firebase/Auth"; // ← doit être Firebase Admin SDK ici

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { displayName, email, password } = req.body;

    try {
      // Créer l'utilisateur avec Firebase Admin SDK
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });

      // Enregistrer les infos dans Firestore
      await db.collection("user").doc(userRecord.uid).set({
        displayName,
        email,
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
