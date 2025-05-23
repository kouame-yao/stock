import { auth, db } from "../../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { uid, email } = req.body;
      if (!uid || !email) {
        res.status(400).json({ message: "Document Manque" });
      }

      auth.updateUser(uid, {
        email: email,
      });
      await db.collection("user").doc(uid).set(
        {
          email,
        },
        { merge: true }
      );

      res.status(200).json({ message: "Email a été mise Ajour avec sussès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error.message);
    }
  }
}
