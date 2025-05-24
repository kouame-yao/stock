import { db } from "../../../firebase/Auth";
import { serverTimestamp } from "firebase/firestore"; // à ajouter
function formatDate(date) {
  const options = { month: "short" };
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("fr-FR", options);
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day} ${month}. ${year}`;
}

// Exemple usage :
formatDate(firebaseTimestamp.toDate());
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // réponse aux pré-requêtes CORS
  }

  if (req.method === "POST") {
    const { name, description, uid } = req.body;

    if (!name || !description || !uid) {
      return res.status(400).json({
        message:
          "Veuillez remplir tous les champs requis : name, description, uid.",
      });
    }

    try {
      const docRef = await db
        .collection("user")
        .doc(uid)
        .collection("categories")
        .add({
          name,
          description,
          createdAt: serverTimestamp(), // Firestore timestamp
        });

      return res.status(200).json({
        message: `Catégorie "${name}" ajoutée avec succès.`,
        id: docRef.id,
      });
    } catch (error) {
      console.error("Erreur d'ajout :", error);
      return res
        .status(500)
        .json({ message: "Impossible d'ajouter la catégorie", error });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
