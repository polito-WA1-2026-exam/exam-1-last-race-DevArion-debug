import express from "express";
import mapController from "../controllers/mapController.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Unauthorized. Anonymous visitors cannot view the network map." });
};

router.get("/", isLoggedIn, mapController.getMapData);

export default router;