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
export const transfer = async (req: Request, res: Response) => {
    const { fromUserId, toUserId, amount } = req.body;

    try {
        const fromUserExists = await User.userExists(fromUserId);
        const toUserExists = await User.userExists(toUserId);

        if (!fromUserExists || !toUserExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.transferFunds(fromUserId, toUserId, amount);
        res.status(200).json({ message: 'Transfer successful' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error transferring funds', error: error.message });
    }
};
export const withdraw = async (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    try {
        const userExists = await User.userExists(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deductBalance(userId, amount);
        res.status(200).json({ message: 'Withdrawal successful' });
    } catch (error: any) {
        if (error.message === 'Insufficient funds') {
            res.status(400).json({ message: 'Insufficient funds' });
        } else if (error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: 'Error withdrawing funds', error: error.message });
        }
    }
};
