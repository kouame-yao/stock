import { auth, db } from "../../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { uid } = req.query;

    try {
      if (!uid) {
        res.status(400).json({ message: "Donner Manquant" });
      }

      db.collection("user").doc(uid).delete();

      auth.deleteUser(uid);

      res.status(200).json({ message: "Utilisateur Supprimer avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Impossible de supprimer l'utilisateur" });
      console.error(error.message);
    }
  }
}
