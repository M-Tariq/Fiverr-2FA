import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-up", authController.SignUp);
router.post("/sign-in", authController.SignIn);
router.post("/generate-otp", authController.GenerateOTP);
router.post("/verify-otp", authController.VerifyOTP);
router.post("/validate-otp", authController.ValidateOTP);
router.post("/disable-otp", authController.DisableOTP);

export default router;
