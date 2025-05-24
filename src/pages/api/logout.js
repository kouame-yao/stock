const cookie = require("cookie");

export default function handler(req, res) {
  // Gestion CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Réponse pour prévol OPTIONS
    return res.status(200).end();
  }

  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 0, // Efface le cookie
      })
    );

    return res.status(200).json({ message: "Déconnexion réussie" });
  } else {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
}
