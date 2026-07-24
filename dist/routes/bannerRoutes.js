"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerController_1 = require("../controllers/bannerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const router = (0, express_1.Router)();
// Public route to get all banners (could be protected based on requirement)
router.get('/', bannerController_1.BannerController.getAllBanners);
// Secure routes for admin to manage banners
router.use(authMiddleware_1.verifyToken, adminMiddleware_1.verifyAdmin);
router.post('/', bannerController_1.BannerController.createBanner);
router.patch('/:id', bannerController_1.BannerController.updateBanner);
router.delete('/:id', bannerController_1.BannerController.deleteBanner);
exports.default = router;
