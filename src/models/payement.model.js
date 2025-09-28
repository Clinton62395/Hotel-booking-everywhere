// models/Paiement.js
import mongoose from "mongoose";
const paiementSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
      required: [true, "La réservation est obligatoire"],
    },
    montant: {
      type: Number,
      required: [true, "Le montant est obligatoire"],
      min: [0, "Le montant ne peut pas être négatif"],
    },
    devise: {
      type: String,
      required: [true, "La devise est obligatoire"],
      default: "EUR",
    },
    methodePaiement: {
      type: String,
      required: [true, "La méthode de paiement est obligatoire"],
      enum: ["carte_credit", "paypal", "virement", "especes"],
    },
    statut: {
      type: String,
      enum: ["en_attente", "traite", "echec", "rembourse", "annule"],
      default: "en_attente",
    },
    transactionId: {
      type: String,
      unique: true,
    },
    stripePaymentIntentId: String,
    paypalOrderId: String,
    detailsPaiement: {
      derniers4Chiffres: String,
      typeCarte: String,
      nomPorteur: String,
      emailPaypal: String,
    },
    adresseFacturation: {
      nom: String,
      prenom: String,
      adresse: String,
      ville: String,
      codePostal: String,
      pays: String,
    },
    dateTraitement: Date,
    dateRemboursement: Date,
    fraisTransaction: {
      type: Number,
      default: 0,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
paiementSchema.index({ reservation: 1 });
paiementSchema.index({ transactionId: 1 });
paiementSchema.index({ statut: 1, createdAt: -1 });

const Paiement = mongoose.model("Paiement", paiementSchema);
export default Paiement;
