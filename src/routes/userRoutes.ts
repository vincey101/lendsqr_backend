import { Router } from 'express';
import { register, fundAccount, transfer } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/fund', fundAccount)
router.post('/transfer', transfer);


export default router;
