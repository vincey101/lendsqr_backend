import { Router } from 'express';
import { register, fundAccount, transfer, withdraw } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/fund', fundAccount)
router.post('/transfer', transfer);
router.post('/withdraw', withdraw);


export default router;
