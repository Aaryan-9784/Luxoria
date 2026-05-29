import { Router } from 'express';
import { getProfile, updateProfile, updateAvatar, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { updateProfileSchema } from '../validations/userValidation.js';
import { changePasswordSchema } from '../validations/authValidation.js';

const router = Router();

router.use(protect);

router.get('/me', getProfile);
router.put('/me', validate(updateProfileSchema), updateProfile);
router.put('/me/avatar', uploadSingle, updateAvatar);
router.put('/me/password', validate(changePasswordSchema), changePassword);

export default router;
