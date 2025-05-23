const cookie = require("cookie");

export default function handler(req, res) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 0, // <-- Efface le cookie
      })
    );

    res.status(200).json({ message: "Déconnexion réussie" });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
