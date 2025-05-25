import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { uid } = req.query;
    const { id } = req.body;

    const docRef = db
      .collection("user")
      .doc(uid)
      .collection("categories")
      .doc(id);

    const SnapRef = await docRef.get();

    if (!SnapRef.exists) {
      return res.status(404).json({ message: "Catégorie introuvable !" });
    }

    try {
      const nom = SnapRef.data().name;

      await docRef.delete();

      res
        .status(200)
        .json({ message: `La cétgorie ${nom} a été supprimer avec succès` });
    } catch (error) {
      res.status(500).json({
        message: `impossible de supprimer la catégorie : ${error.message}`,
      });
    }
  }
}
