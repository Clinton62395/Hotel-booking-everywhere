import express from "express";
import {
  createHotel,
  deleteHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
} from "../controllers/hotel.controller.js";
import {
  authorizeRoles,
  verifyToken,
} from "../middlewares/protectedRoute.middleware.js";

const router = express.Router();

router.post(
  "/hotels",
  verifyToken,
  authorizeRoles("hotelManager", "admin"),
  createHotel
);

// delete hotel route
router.delete(
  "/hotels/:id",
  verifyToken,
  authorizeRoles("hotelManager", "admin"),
  deleteHotel
);

// route ot update hotel
router.put(
  "hotels/:id",
  verifyToken,
  authorizeRoles("hotelManager", "admin"),
  updateHotel
);

// route to get all hotels
router.get("/hotels", getAllHotels);

// route to get single hotel details
router.get("/hotels/:id", getHotelById);

export default router;
