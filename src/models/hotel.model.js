// models/Hotel.js
import slugify from "slugify";
import mongoose from "mongoose";
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de l'hôtel est obligatoire"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      maxlength: [2000, "La description ne peut pas dépasser 2000 caractères"],
    },
    adresse: {
      street: {
        type: String,
        required: [true, "La rue est obligatoire"],
      },

      city: {
        type: String,
        required: [true, "La ville est obligatoire"],
      },
      postalCode: {
        type: String,
        required: [true, "Le code postal est obligatoire"],
      },
      country: {
        type: String,
        required: [true, "Le pays est obligatoire"],
        default: "Guinea",
      },
      coordonnees: {
        latitude: {
          type: Number,
          required: [true, "La latitude est obligatoire"],
        },
        longitude: {
          type: Number,
          required: [true, "La longitude est obligatoire"],
        },
      },
    },
    nombreEtoiles: {
      type: Number,
      min: [1, "Minimum 1 étoile"],
      max: [5, "Maximum 5 étoiles"],
      required: [true, "Le nombre d'étoiles est obligatoire"],
    },
    noteMoyenne: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    nombreAvis: {
      type: Number,
      default: 0,
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

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    equipements: [
      {
        type: String,
        enum: [
          "wifi_gratuit",
          "parking",
          "piscine",
          "spa",
          "restaurant",
          "bar",
          "salle_sport",
          "climatisation",
          "room_service",
          "concierge",
          "blanchisserie",
          "centre_affaires",
          "animaux_acceptes",
        ],
      },
    ],
    services: [
      {
        nom: String,
        description: String,
        prix: Number,
        gratuit: { type: Boolean, default: false },
      },
    ],
    policies: {
      checkin: {
        type: String,
        default: "15:00",
      },
      checkout: {
        type: String,
        default: "11:00",
      },
      annulation: {
        type: String,
        required: true,
        enum: ["flexible", "modere", "strict"],
      },
      enfants: {
        acceptes: { type: Boolean, default: true },
        ageLimite: { type: Number, default: 12 },
        tarif: String,
      },
      animaux: {
        acceptes: { type: Boolean, default: false },
        supplement: Number,
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Le téléphone est obligatoire"],
      },
      email: {
        type: String,
        required: [true, "L'email est obligatoire"],
      },
      site_web: String,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Le propriétaire est obligatoire"],
    },
    statut: {
      type: String,
      enum: ["actif", "inactif", "en_attente"],
      default: "en_attente",
    },
    dateCreation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour optimiser les recherches
hotelSchema.index({ "adresse.city": 1, "adresse.country": 1 });
hotelSchema.index({ "adresse.coordonnees": "2dsphere" });
hotelSchema.index({ nombreEtoiles: 1, noteMoyenne: -1 });

// Virtual pour populate les chambres
hotelSchema.virtual("chambres", {
  ref: "Chambre",
  localField: "_id",
  foreignField: "hotel",
});

hotelSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// Virtual pour populate les avis
hotelSchema.virtual("avis", {
  ref: "Avis",
  localField: "_id",
  foreignField: "hotel",
});

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
