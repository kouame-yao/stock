import { db } from "../../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { uid } = req.query;

    try {
      if (!uid) {
        res.status(400).json({ message: "Uid Manquant" });
      }

      const docRef = db.collection("user").doc(uid);
      const SnapRef = await docRef.get();
      if (!SnapRef.exists) {
        res.status(405).json({ message: "UID introuvable" });
      }

      const table = [];
      table.push({ id: SnapRef.uid, ...SnapRef.data() });
      res.status(200).json({ message: "Data Trouver", table: table });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la recupération des données " });
      console.error(error.message);
    }
  }
}
