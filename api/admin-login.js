export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { token } = req.body || {};

    if (!process.env.ADMIN_API_TOKEN) {
      return res.status(500).json({
        success: false,
        message: "ADMIN_API_TOKEN is missing on server",
      });
    }

    if (!token || token !== process.env.ADMIN_API_TOKEN) {
      return res.status(401).json({
        success: false,
        message: "Code administrateur incorrect",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Connexion administrateur réussie",
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}