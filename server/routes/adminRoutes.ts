import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { verifyToken } from '../middlewares/authMiddleware';
import { verifyAdmin } from '../middlewares/adminMiddleware';

const router = Router();

// Secure all admin routes
router.use(verifyToken, verifyAdmin);

// Dashboard Stats
router.get('/dashboard', AdminController.getDashboardStats);

// Users
router.patch('/profile', AdminController.updateProfile);
router.post('/users', AdminController.createUser);
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUser);
router.patch('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Activities
router.post('/activities', AdminController.createActivity);
router.get('/activities', AdminController.getActivities);
router.patch('/activities/:id', AdminController.updateActivity);
router.delete('/activities/:id', AdminController.deleteActivity);

// Points
router.post('/points/add', AdminController.addPoints);
router.post('/points/bulk', AdminController.bulkAddPoints);
router.get('/points/history', AdminController.getPointsHistory);

// Rewards
router.post('/rewards', AdminController.createReward);
router.get('/rewards', AdminController.getRewards);
router.patch('/rewards/:id', AdminController.updateReward);
router.delete('/rewards/:id', AdminController.deleteReward);

// Redeems
router.get('/redeems', AdminController.getRedeems);
router.patch('/redeems/:id/status', AdminController.updateRedeemStatus);

// Feedbacks
router.get('/feedbacks', AdminController.getFeedbacks);
router.patch('/feedbacks/:id', AdminController.updateFeedback);

export default router;
