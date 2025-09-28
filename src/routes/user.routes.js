import Router from "express";
import {
    handleLogin,
    handleLogout,
    handleRegister,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const userRoutes = Router();

// auth routes
userRoutes.route("/register").post(handleRegister);
userRoutes.route("/login").post(handleLogin);
userRoutes.route("/logout").post(isLoggedIn, handleLogout);

export default userRoutes;