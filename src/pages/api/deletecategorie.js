import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { uid } = req.query;
    const { id } = req.body;

    try {
      const docRef = db
        .collection("user")
        .doc(uid)
        .collection("categories")
        .doc(id);

      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        return res.status(404).json({ message: "Catégorie introuvable" });
      }

      const nom = snapshot.data().name;

      await docRef.delete();

      res.status(200).json({
        message: `La catégorie "${nom}" a été supprimée`,
      });
    } catch (error) {
      console.error("Erreur de suppression :", error);
      res
        .status(500)
        .json({ message: "Impossible de supprimer cette catégorie" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
