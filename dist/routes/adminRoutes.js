"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const router = (0, express_1.Router)();
// Secure all admin routes
router.use(authMiddleware_1.verifyToken, adminMiddleware_1.verifyAdmin);
// Dashboard Stats
router.get('/dashboard', adminController_1.AdminController.getDashboardStats);
// Users
router.patch('/profile', adminController_1.AdminController.updateProfile);
router.post('/users', adminController_1.AdminController.createUser);
router.get('/users', adminController_1.AdminController.getUsers);
router.get('/users/:id', adminController_1.AdminController.getUser);
router.patch('/users/:id', adminController_1.AdminController.updateUser);
router.delete('/users/:id', adminController_1.AdminController.deleteUser);
// Activities
router.post('/activities', adminController_1.AdminController.createActivity);
router.get('/activities', adminController_1.AdminController.getActivities);
router.patch('/activities/:id', adminController_1.AdminController.updateActivity);
router.delete('/activities/:id', adminController_1.AdminController.deleteActivity);
// Points
router.post('/points/add', adminController_1.AdminController.addPoints);
router.post('/points/bulk', adminController_1.AdminController.bulkAddPoints);
router.get('/points/history', adminController_1.AdminController.getPointsHistory);
// Rewards
router.post('/rewards', adminController_1.AdminController.createReward);
router.get('/rewards', adminController_1.AdminController.getRewards);
router.patch('/rewards/:id', adminController_1.AdminController.updateReward);
router.delete('/rewards/:id', adminController_1.AdminController.deleteReward);
// Redeems
router.get('/redeems', adminController_1.AdminController.getRedeems);
router.patch('/redeems/:id/status', adminController_1.AdminController.updateRedeemStatus);
// Feedbacks
router.get('/feedbacks', adminController_1.AdminController.getFeedbacks);
router.patch('/feedbacks/:id', adminController_1.AdminController.updateFeedback);
exports.default = router;
