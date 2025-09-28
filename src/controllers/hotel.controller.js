// controller to create hotels

import Hotel from "../models/hotel.model.js";

export const createHotel = async (req, res, next) => {
  try {
    const {
      name,
      adresse,
      description,
      nombreEtoiles,
      equipements,
      images,
      contact,
      services,
      policies,
    } = req.body;

    const requiredFields = [
      "name",
      "adresse",
      "description",
      "nombreEtoiles",
      "contact",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        const error = new Error(`Le champ ${field} est obligatoire.`);
        return next(error);
      }
    }

    const newHotel = await Hotel.create({
      name,
      adresse,
      description,
      nombreEtoiles,
      equipements,
      images,
      contact,
      services,
      policies,
      owner: req.user._id, // assuming req.user is set by auth middleware
    });

    res.status(201).json({
      status: "success",
      message: "Hôtel créé avec succès.",
      data: {
        hotel: newHotel,
      },
    });
  } catch (err) {
    next(err);
  }
};

//hotel delete controller
export const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      const error = new Error("Hôtel non trouvé.");
      error.statusCode = 404;
      return next(error);
    }

    if (
      hotel.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error(
        "Vous n'êtes pas autorisé à supprimer cet hôtel."
      );
      error.statusCode = 403;
      return next(error);
    }
    await hotel.deleteOne();

    res.status(204).json({
      status: "success",
      message: "Hôtel supprimé avec succès.",
    });
  } catch (err) {
    next(err);
  }
};

// controller to update hotel details

export const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      const error = new Error("Hôtel non trouvé.");
      error.statusCode = 404;
      return next(error);
    }

    if (
      hotel.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      const error = new Error(
        "Vous n'êtes pas autorisé à mettre à jour cet hôtel."
      );
      error.statusCode = 403;
      return next(error);
    }

    const updateHotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Hôtel mis à jour avec succès.",
      hotel: updateHotel,
    });
  } catch (err) {
    next(err);
  }
};

// controller to get all hotels
export const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({});
    res.status(200).json({
      status: "success",
      message: "Liste de tous les hôtels",
      hotels,
    });
  } catch (err) {
    next(err);
  }
};

// controller to get single hotel details
export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      const error = new Error("Hôtel non trouvé.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      status: "success",
      message: "Détails de l'hôtel",
      hotel,
    });
  } catch (err) {
    next(err);
  }
};
