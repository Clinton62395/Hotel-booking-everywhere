export default function errorHandler(err, req, res, next) {
  // 1. Déterminer le statut HTTP (par défaut 500)
  const status = err.statusCode || 500;

  // 2. Log de l'erreur côté serveur
  console.error("all error about stack===>", err.stack);

  // 3. Toujours répondre en JSON, éliminant le besoin de res.render()
  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    // N'expose le stack trace qu'en mode développement
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
}
