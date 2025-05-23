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
    const { name, description, uid } = req.body;
    if (!name || !description || !uid) {
      return res.status(400).json({
        message: `remplir les champs , ${name} , ${description} , ${uid}`,
      });
    }
    try {
      const docref = await db
        .collection("user")
        .doc(uid)
        .collection("categories")
        .add({
          name,
          description,
          createdAt: date,
        });

      res
        .status(200)
        .json({
          message: `Produits ajouter avec succès ${name}`,
          id: docref.id,
        });
    } catch (error) {
      res.status(500).json({ message: "Impossible d'ajouter", error });
      console.error("error:", error);
    }
  }
}
