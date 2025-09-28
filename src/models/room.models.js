
// models/Chambre.js
import mongoose from "mongoose";
const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: [true, "L'hôtel est obligatoire"],
    },
    numero: {
      type: String,
      required: [true, "Le numéro de chambre est obligatoire"],
    },
    type: {
      type: String,
      required: [true, "Le type de chambre est obligatoire"],
      enum: [
        "standard",
        "superieure",
        "deluxe",
        "suite",
        "suite_presidentielle",
      ],
    },
    nom: {
      type: String,
      required: [true, "Le nom de la chambre est obligatoire"],
    },
    description: {
      type: String,
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
    },
    capaciteMax: {
      adultes: {
        type: Number,
        required: [true, "Le nombre d'adultes est obligatoire"],
        min: 1,
      },
      enfants: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    superficie: {
      type: Number,
      required: [true, "La superficie est obligatoire"],
      min: [10, "Superficie minimum 10 m²"],
    },
    prix: {
      parNuit: {
        type: Number,
        required: [true, "Le prix par nuit est obligatoire"],
        min: [0, "Le prix ne peut pas être négatif"],
      },
      devise: {
        type: String,
        default: "EUR",
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        description: String,
        isMain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    equipements: [
      {
        type: String,
        enum: [
          "wifi_gratuit",
          "climatisation",
          "television",
          "minibar",
          "coffre_fort",
          "seche_cheveux",
          "balcon",
          "vue_mer",
          "vue_montagne",
          "baignoire",
          "douche",
          "peignoir",
          "machine_cafe",
          "room_service",
        ],
      },
    ],
    literie: [
      {
        type: {
          type: String,
          enum: [
            "lit_simple",
            "lit_double",
            "lit_queen",
            "lit_king",
            "canape_lit",
          ],
          required: true,
        },
        nombre: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    disponible: {
      type: Boolean,
      default: true,
    },
    etage: {
      type: Number,
      required: [true, "L'étage est obligatoire"],
    },
    caracteristiques: [
      {
        nom: String,
        valeur: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour optimiser les recherches
chambreSchema.index({ hotel: 1, disponible: 1 });
chambreSchema.index({ type: 1, "prix.parNuit": 1 });
chambreSchema.index({ hotel: 1, numero: 1 }, { unique: true });

// Virtual pour calculer la capacité totale
chambreSchema.virtual("capaciteTotale").get(function () {
  return this.capaciteMax.adultes + this.capaciteMax.enfants;
});

const Room = mongoose.model("Room", roomSchema);