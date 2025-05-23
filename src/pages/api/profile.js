// pages/api/profile.js
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = "hjskhfkdfkfdhskfhsdkjhfkshkhg";

export default async function handler(req, res) {
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
