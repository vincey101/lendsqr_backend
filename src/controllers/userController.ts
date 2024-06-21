import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.createUser({ email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }  
};

export const fundAccount = async (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    try {
        const userExists = await User.userExists(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.updateBalance(userId, amount);
        res.status(200).json({ message: 'Account funded successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error funding account', error: error.message });
    }
};