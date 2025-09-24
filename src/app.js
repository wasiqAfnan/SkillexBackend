import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { healthCheckRoutes, userRoutes } from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middlewares.js";

const app = express();

// external middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/test", healthCheckRoutes);
app.use("/api/user", userRoutes);

app.all(/./, (req, res) => {
    res.status(404).json({ message: "Page does not exist" });
});

app.use(errorMiddleware);

export default app;
