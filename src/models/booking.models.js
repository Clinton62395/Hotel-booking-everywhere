// models/Reservation.js
import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    codeReservation: {
      type: String,
      unique: true,
      required: true,
    },
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
    chambre: {
      type: mongoose.Schema.ObjectId,
      ref: "Chambre",
      required: [true, "La chambre est obligatoire"],
    },
    dates: {
      checkin: {
        type: Date,
        required: [true, "La date d'arrivée est obligatoire"],
      },
      checkout: {
        type: Date,
        required: [true, "La date de départ est obligatoire"],
      },
    },
    voyageurs: {
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
    prix: {
      sousTotal: {
        type: Number,
        required: true,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      fraisService: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      devise: {
        type: String,
        default: "EUR",
      },
    },
    statut: {
      type: String,
      enum: ["en_attente", "confirmee", "annulee", "terminee", "no_show"],
      default: "en_attente",
    },
    informationsClient: {
      nom: { type: String, required: true },
      prenom: { type: String, required: true },
      email: { type: String, required: true },
      telephone: { type: String, required: true },
      demandesSpeciales: String,
    },
    paiement: {
      type: mongoose.Schema.ObjectId,
      ref: "Paiement",
    },
    dateAnnulation: Date,
    raisonAnnulation: String,
    remboursement: {
      montant: Number,
      statut: {
        type: String,
        enum: ["en_attente", "traite", "refuse"],
      },
      dateTraitement: Date,
    },
    avis: {
      type: mongoose.Schema.ObjectId,
      ref: "Avis",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour optimiser les recherches
reservationSchema.index({ utilisateur: 1, statut: 1 });
reservationSchema.index({ hotel: 1, "dates.checkin": 1, "dates.checkout": 1 });
reservationSchema.index({ codeReservation: 1 });

// Virtual pour calculer le nombre de nuits
reservationSchema.virtual("nombreNuits").get(function () {
  const diffTime = Math.abs(this.dates.checkout - this.dates.checkin);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Middleware pour générer le code de réservation
reservationSchema.pre("save", function (next) {
  if (!this.codeReservation) {
    this.codeReservation =
      "RES-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Validation des dates
reservationSchema.pre("save", function (next) {
  if (this.dates.checkin >= this.dates.checkout) {
    next(new Error("La date de départ doit être après la date d'arrivée"));
  }
  if (this.dates.checkin < new Date()) {
    next(new Error("La date d'arrivée ne peut pas être dans le passé"));
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
