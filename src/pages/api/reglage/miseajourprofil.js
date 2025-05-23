import { auth, db } from "../../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uid, displayName } = req.body;

    try {
      if (!uid || !displayName) {
        return res.status(400).json({ message: "uid ou displayName manquant" });
      }
      auth.updateUser(uid, {
        displayName,
      });
      await db.collection("user").doc(uid).set(
        {
          displayName,
        },
        { merge: true }
      );

      res.status(200).json({ message: "Mise Ajour effectuer avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise ajour" });
      console.error(error.message);
    }
  }
}
