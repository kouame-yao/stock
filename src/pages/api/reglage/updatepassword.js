import { auth, db } from "../../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { uid, password } = req.body;
      if (!uid || !password) {
        res.status(400).json({ message: "Document Manque" });
      }

      auth.updateUser(uid, {
        password: password,
      });

      res
        .status(200)
        .json({ message: "Password a été mise Ajour avec sussès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error.message);
    }
  }
}
