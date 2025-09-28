import User from "../models/auth.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { appError } from "../services/appError.service.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastname, email, phoneNumber, password, country } =
      req.body;

    const requiredFields = [
      "firstName",
      "lastname",
      "email",
      "phoneNumber",
      "password",
      "country",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        const error = new Error(`Le champ ${field} est obligatoire.`);
        error.statusCode = 400;
        return next(error);
      }
    }

    // email regex validation
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      const error = new Error("Email invalide.");
      error.statusCode = 400;
      return next(error);
    }

    // phone number regex validation
    if (!/^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber)) {
      const error = new Error("Numéro de téléphone invalide.");
      error.statusCode = 400;
      return next(error);
    }
    // password length validation
    if (password.length < 8) {
      const error = new Error(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      const error = new Error("Email déjà utilisé.");
      error.statusCode = 400;
      return next(error);
    }

    const newUser = await User.create({
      firstName,
      lastname,
      email,
      phoneNumber,
      password,
      country,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      refreshToken,
      data: {
        id: newUser._id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        name: newUser.fullname,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// login controller

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email et mot de passe sont requis.");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Identifiants invalides.");
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await user.verifierPassword(password);
    if (!isMatch) {
      const error = new Error("Identifiants invalides.");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token,
      refreshToken,
      user: {
        firstName: user.firstName,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
