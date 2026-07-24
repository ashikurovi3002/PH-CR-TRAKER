import { Router } from 'express';
import { PublicController } from '../controllers/publicController';

const router = Router();

router.get('/banners', PublicController.getBanners);
router.get('/stats', PublicController.getStats);
router.get('/heroes', PublicController.getHeroes);
router.get('/feedbacks', PublicController.getFeedbacks);

export default router;
