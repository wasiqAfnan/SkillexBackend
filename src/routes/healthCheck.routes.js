import { Router } from "express";
import { handleHealthCheck } from "../controllers/healthCheck.controllers.js";

const healthCheckRoutes = Router();

healthCheckRoutes.route("/").get(handleHealthCheck)

export default healthCheckRoutes;