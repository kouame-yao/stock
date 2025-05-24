import { parse } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = "hjskhfkdfkfdhskfhsdkjhfkshkhg";

export default async function handler(req, res) {
  // Gestion CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Réponse à la requête OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;

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
