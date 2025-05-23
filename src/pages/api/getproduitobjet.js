import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id, uid } = req.query;

    try {
      const DocRef = await db
        .collection("user")
        .doc(uid)
        .collection("products")
        .doc(id)
        .get();
      if (!DocRef.exists) {
        res.status(400).json({ message: "Table existe pas !" });
      }
      const table = [];
      table.push({ id: DocRef.id, ...DocRef.data() });
      res.status(200).json({ message: "Table", table: table });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur de recuperation des données", error });
    }
  }
}
