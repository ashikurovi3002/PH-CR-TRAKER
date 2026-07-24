"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.post('/register', uploadMiddleware_1.upload.single('profileImage'), authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
router.post('/forgot-password', authController_1.AuthController.forgotPassword);
router.post('/reset-password', authController_1.AuthController.resetPassword);
router.post('/refresh-token', authController_1.AuthController.refreshToken);
router.post('/logout', authMiddleware_1.verifyToken, authController_1.AuthController.logout); // Optional: verifyToken ensures only logged in users can logout
router.get('/me', authMiddleware_1.verifyToken, authController_1.AuthController.me);
exports.default = router;
