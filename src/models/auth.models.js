// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    lastname: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email invalide",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Le téléphone est obligatoire"],
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Numéro de téléphone invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "hotelManager"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "default-avatar.jpg",
    },
    dateOfBirth: Date,
    adresse: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },

    preferences: {
      langue: {
        type: String,
        default: "fr",
      },
      currency: {
        type: String,
        default: "EUR",
      },

      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    LastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour optimiser les recherches
userSchema.index({ email: 1 });

// Virtual pour le nom complet
userSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastname}`;
});

// Middleware pour hasher le mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Méthode pour vérifier le mot de passe
userSchema.methods.verifierPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Méthode pour créer un token de reset
userSchema.methods.creerTokenReset = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
