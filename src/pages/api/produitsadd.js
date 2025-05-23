import { db } from "../../../firebase/Auth";
function formatDate(date) {
  const options = { month: "short" }; // 'mai'
  const hours = date.getHours().toString().padStart(2, "0"); // 03
  const minutes = date.getMinutes().toString().padStart(2, "0"); // 25
  const day = date.getDate().toString().padStart(2, "0"); // 09
  const month = date.toLocaleDateString("fr-FR", options); // "mai"
  const year = date.getFullYear(); // 2025

  return `${hours}:${minutes} ${day} ${month}. ${year}`;
}
const now = new Date();
const date = formatDate(now);
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, price, unit, categoryId, description, categorie } = req.body;
    const { uid } = req.query;
    if (!name || !price || !unit || !description) {
      return res.status(404).json({ message: "Veillez remplir tout les" });
    }
    try {
      const docref = await db
        .collection("user")
        .doc(uid)
        .collection("products")
        .add({
          name,
          price,
          quantity: 0,
          unit,
          categoryId,
          description,
          categorie,
          date,
        });

      res.status(200).json({
        message: `Produits ${name} ajouter avec succès `,
        id: docref.id,
      });
    } catch (error) {
      console.error("error:", error.message);

      res.status(500).json({ message: error.message });
    }
  }
}
