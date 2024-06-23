import { Router } from 'express';
import { register, fundAccount, transfer, withdraw } from '../controllers/userController';
import { validateToken } from '../middleware/fauxAuth';

const router = Router();

router.post('/register', register);
router.post('/fund', validateToken, fundAccount);
router.post('/transfer', validateToken, transfer); 
router.post('/withdraw', validateToken, withdraw); 

export default router;
