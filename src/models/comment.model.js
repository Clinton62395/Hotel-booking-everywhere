// models/Avis.js
import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est obligatoire"],
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: [true, "L'hôtel est obligatoire"],
    },
    reservation: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
      required: [true, "La réservation est obligatoire"],
    },
    notes: {
      general: {
        type: Number,
        required: [true, "La note générale est obligatoire"],
        min: 1,
        max: 5,
      },
      proprete: {
        type: Number,
        min: 1,
        max: 5,
      },
      service: {
        type: Number,
        min: 1,
        max: 5,
      },
      confort: {
        type: Number,
        min: 1,
        max: 5,
      },
      emplacement: {
        type: Number,
        min: 1,
        max: 5,
      },
      rapport_qualite_prix: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    commentaire: {
      type: String,
      maxlength: [1000, "Le commentaire ne peut pas dépasser 1000 caractères"],
    },
    points_positifs: [String],
    points_negatifs: [String],
    recommande: {
      type: Boolean,
      default: true,
    },
    sejour: {
      motif: {
        type: String,
        enum: ["loisir", "affaires", "famille", "couple", "solo"],
      },
      duree: String,
    },
    reponse_hotel: {
      contenu: String,
      date: Date,
      auteur: String,
    },
    statut: {
      type: String,
      enum: ["en_attente", "approuve", "rejete"],
      default: "en_attente",
    },
    utile_votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
avisSchema.index({ hotel: 1, statut: 1, createdAt: -1 });
avisSchema.index({ utilisateur: 1, hotel: 1 }, { unique: true });

const Comment = mongoose.model("Comment", commentSchema);
