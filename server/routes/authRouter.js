import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/", authController.login);
router.get("/current-user", authController.getCurrentSession);
router.delete("/delete", authController.logout);

export default router;