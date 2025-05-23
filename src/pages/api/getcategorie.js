import { db } from "../../../firebase/Auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { uid } = req.query;
    const docRef = await db
      .collection("user")
      .doc(uid)
      .collection("categories")
      .get();

    const table = [];
    docRef.forEach((doc) => {
      table.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({ message: "Table:", table });
  }
}
