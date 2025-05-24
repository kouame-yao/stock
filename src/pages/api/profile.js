import { parse } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export default async function handler(req, res) {
  // Autoriser uniquement GET et POST
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Récupérer le token JWT depuis les cookies
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Aucun token trouvé" });
  }

  try {
    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    // Renvoyer les données utilisateur décodées
    return res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
