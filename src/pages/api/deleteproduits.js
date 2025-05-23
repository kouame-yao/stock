import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { uid } = req.query;
    const { id } = req.body;
    if (!uid || !id) {
      return res.status(400).json({ message: "Id ou UID manquant" });
    }
    try {
      const DocRef = db
        .collection("user")
        .doc(uid)
        .collection("products")
        .doc(id);

      const Spnap = await DocRef.get();

      if (!Spnap.exists) {
        res.status(404).json({ message: "Produit introuvable" });
      }
      const nom = Spnap.data().name;

      await DocRef.delete();
      return res
        .status(200)
        .json({ message: `Le produit ${nom} a été supprimer avec succès` });
    } catch (error) {
      res.status(500).json({ message: "Impossibe de supprimer le produit !" });
      console.log(error);
    }
  }
}
