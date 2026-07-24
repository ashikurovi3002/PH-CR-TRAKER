"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ambassadorController_1 = require("../controllers/ambassadorController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Secure ambassador routes
router.use(authMiddleware_1.verifyToken);
router.get('/leaderboard', ambassadorController_1.AmbassadorController.getLeaderboard);
router.get('/dashboard', ambassadorController_1.AmbassadorController.getDashboard);
router.get('/activities', ambassadorController_1.AmbassadorController.getActivities);
router.get('/redeems', ambassadorController_1.AmbassadorController.getRedeems);
router.get('/rewards', ambassadorController_1.AmbassadorController.getRewards);
router.post('/redeems', ambassadorController_1.AmbassadorController.requestRedeem);
router.patch('/profile', ambassadorController_1.AmbassadorController.updateProfile);
router.post('/feedback', ambassadorController_1.AmbassadorController.submitFeedback);
router.get('/feedback', ambassadorController_1.AmbassadorController.getFeedbacks);
exports.default = router;
