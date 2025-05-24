import { parse } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;
  console.log("Cookies reçus:", req.headers.cookie);
  if (!token) {
    return res.status(401).json({ error: "Aucun token trouvé" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
