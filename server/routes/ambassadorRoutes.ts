import { Router } from 'express';
import { AmbassadorController } from '../controllers/ambassadorController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Secure ambassador routes
router.use(verifyToken);

router.get('/leaderboard', AmbassadorController.getLeaderboard);
router.get('/dashboard', AmbassadorController.getDashboard);
router.get('/activities', AmbassadorController.getActivities);
router.get('/redeems', AmbassadorController.getRedeems);
router.get('/rewards', AmbassadorController.getRewards);
router.post('/redeems', AmbassadorController.requestRedeem);
router.patch('/profile', AmbassadorController.updateProfile);
router.post('/feedback', AmbassadorController.submitFeedback);
router.get('/feedback', AmbassadorController.getFeedbacks);

export default router;
