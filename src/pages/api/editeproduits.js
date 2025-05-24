import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { uid } = req.query;
    const { description, name, price, unit, id } = req.body;

    try {
      if (!description || !name || !price || !id) {
        res.status(400).json({ message: "il manque des champs" });
      }
      const DocRef = await db
        .collection("user")
        .doc(uid)
        .collection("products")
        .doc(id)
        .update({
          description,
          name,
          price,
          unit,
        });
      res
        .status(200)
        .json({ message: "Mise ajour du produit effectuer avec succès" });
    } catch (error) {
      res
        .status(200)
        .json({ message: "Impossible de mettre ajour le produit" });
      console.log("message:", error);
    }
  }
}