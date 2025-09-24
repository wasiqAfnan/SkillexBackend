import Router from "express";
import { handleRegister } from "../controllers/userControllers.js";

const userRoutes = Router();

userRoutes.route("/register").post(handleRegister);

export default userRoutes;