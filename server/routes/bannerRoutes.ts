import { Router } from 'express';
import { BannerController } from '../controllers/bannerController';
import { verifyToken } from '../middlewares/authMiddleware';
import { verifyAdmin } from '../middlewares/adminMiddleware';

const router = Router();

// Public route to get all banners (could be protected based on requirement)
router.get('/', BannerController.getAllBanners);

// Secure routes for admin to manage banners
router.use(verifyToken, verifyAdmin);

router.post('/', BannerController.createBanner);
router.patch('/:id', BannerController.updateBanner);
router.delete('/:id', BannerController.deleteBanner);

export default router;
