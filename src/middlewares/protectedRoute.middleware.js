// user protection middleware

import User from "../models/auth.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const headersToken = req.headers.authorization;

    if (!headersToken || !headersToken.startsWith("Bearer ")) {
      const error = new Error("Token d'authentification manquant ou invalide.");
      error.statusCode = 401;
      return next(error);
    }

    const token = headersToken.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const error = new Error("Token d'authentification invalide.");
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("Utilisateur non trouvé.");
      error.statusCode = 404;
      return next(error);
    }
    req.user = user; // Attacher l'utilisateur à la requête

    next();
  } catch (err) {
    next(err);
  }
};

// autorisation middleware des roles

export const authorizeRoles = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const error = new Error("Accès refusé. Rôle insuffisant.");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
