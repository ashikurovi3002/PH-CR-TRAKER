import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/register', upload.single('profileImage'), AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', verifyToken, AuthController.logout); // Optional: verifyToken ensures only logged in users can logout
  router.get('/me', verifyToken, AuthController.me);

export default router;
