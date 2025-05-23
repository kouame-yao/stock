import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { uid } = req.query;

    try {
      const docRef = await db
        .collection("user")
        .doc(uid)
        .collection("historique")
        .get();
      if (docRef.empty) {
        res.status(400).json({ message: "Tableau introuvable" });
      }
      const table = [];
      docRef.forEach((doc) => {
        table.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json({ message: "récuperation effectuer", table: table });
    } catch (error) {
      res.status(500).json({ message: "erreur", error });
      console.warn("Erreur");
    }
  } else {
    console.log("Method incorect");
  }
}
