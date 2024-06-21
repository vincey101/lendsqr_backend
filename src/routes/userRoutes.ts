import { Router } from 'express';
import { register, fundAccount } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/fund', fundAccount)


export default router;
