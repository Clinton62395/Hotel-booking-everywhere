import express, { json } from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandle.midleware.js";
import connectDB from "./config/db.config.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import logger from "./models/logger.middleware.js";
import deleteRouter from "./routes/hotel.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(json());

app.use(logger);

app.use("/auth", authRouter);

// hotel routes
app.use("/api", deleteRouter);

app.get("/", (req, res) => {
  res.send("welcom to booking hotel website ");
});

// global  middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () => {
    console.log(`✅server is running on port ${PORT} `);
    console.log(`👉http://localhost:${PORT} `);
  })
);
