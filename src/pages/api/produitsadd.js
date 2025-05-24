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
  // Gestion CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Réponse aux requêtes OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { name, price, unit, categoryId, description, categorie } = req.body;
  const { uid } = req.query;

  if (!name || !price || !unit || !description) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs requis" });
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

    return res.status(200).json({
      message: `Produit ${name} ajouté avec succès`,
      id: docref.id,
    });
  } catch (error) {
    console.error("error:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
