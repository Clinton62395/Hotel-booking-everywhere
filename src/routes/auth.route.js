import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { createHotel } from "../controllers/hotel.controller.js";
// import { hotelManagerOnly } from "../middlewares/hotelManage.middleware.js";


const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// create hotel route


export default router;
