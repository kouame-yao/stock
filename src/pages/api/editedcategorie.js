import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { uid } = req.query;
    const { description, name, id } = req.body;
    if (!description || !name || !id) {
      return res.status(400).json({ message: "manque des champs" });
    }
    try {
      if (!id) {
        res.status(400).json({ message: "Id manquant" });
      }
      const docRef = await db
        .collection("user")
        .doc(uid)
        .collection("categories")
        .doc(id)
        .update({
          name: name,
          description: description,
        });
      res.status(200).json({
        message: `mise ajour de la cétégorie NOM: ${name} , DESCRIPTION: ${description}`,
      });
    } catch (error) {
      res.status(500).json({
        message: `Impossible de mettre ajour les champs ${name} , ${description}`,
      });
    }
  }
}
