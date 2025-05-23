import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uid, id } = req.query;
    const { newQuantity } = req.body;

    if (!uid || !id || isNaN(newQuantity)) {
      return res
        .status(400)
        .json({ message: "Paramètres manquants ou invalides" });
    }

    try {
      const docRef = db
        .collection("user")
        .doc(uid)
        .collection("products")
        .doc(id);

      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return res.status(404).json({ message: "Document non trouvé" });
      }

      const data = docSnap.data();
      const prevQuant = data.quantity;
      const quantNumber = Number(newQuantity);

      const nouveauQuant = prevQuant - quantNumber;
      if (prevQuant < quantNumber || prevQuant === 0) {
        return res.status(405).json({
          message: `Quantité insuffisante vaillez alimenter le stock! ${prevQuant}`,
        });
      }
      await docRef.update({ quantity: nouveauQuant });
      await db.collection("user").doc(uid).collection("historique").add({
        name: data.name,
        categorie: data.categorie,
        retraire: quantNumber, // On stocke la quantité retirée (positive)
        date: new Date(),
      });
      return res.status(200).json({
        message: "Quantité retirée avec succès",
        ancienne: prevQuant,
        nouvelle: nouveauQuant,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error.message || error.toString(),
      });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
