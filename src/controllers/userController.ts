import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import { generateToken, validateToken } from '../middleware/fauxAuth';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.getUserById(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.createUser({ email, password: hashedPassword, balance: 0 });

        const token = await generateToken(email);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const fundAccount = async (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    try {
        const userExists = await UserModel.userExists(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        await UserModel.updateBalance(userId, amount);
        res.status(200).json({ message: 'Account funded successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error funding account', error: error.message });
    }
};

export const transfer = async (req: Request, res: Response) => {
    const { fromUserId, toUserId, amount } = req.body;

    try {
        const fromUser = await UserModel.getUserById(fromUserId);
        const toUser = await UserModel.getUserById(toUserId);

        if (!fromUser || !toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fromUser.balance === undefined || fromUser.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        await UserModel.transferFunds(fromUserId, toUserId, amount);
        res.status(200).json({ message: 'Transfer successful' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error transferring funds', error: error.message });
    }
};

export const withdraw = async (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    try {
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.balance === undefined || user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        await UserModel.deductBalance(userId, amount);
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
