import { Router } from "express";
import { handleDbPing, handleHealthCheck } from "../controllers/healthCheck.controllers.js";

const healthCheckRoutes = Router();

healthCheckRoutes.route("/").get(handleHealthCheck);

// db ping route
healthCheckRoutes.route("/db-ping").get(handleDbPing);

export default healthCheckRoutes;
