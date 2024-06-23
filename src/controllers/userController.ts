import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { generateToken } from '../middleware/fauxAuth';



const KARMA_API_KEY = process.env.KARMA_API_KEY;
const KARMA_API_URL = process.env.KARMA_API_URL;



const onboardUser = async (email: string, password: string) => {
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.createUser({ email, password: hashedPassword, balance: 0 });

    const token = generateToken(email);
    return token;
};

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const karmaUrl = `${KARMA_API_URL}/${encodeURIComponent(email)}`;

        const response = await axios.get(karmaUrl, {
            headers: {
                Authorization: `Bearer ${KARMA_API_KEY}`
            }
        });

        const karmaStatus = response.data.status;
        const karmaMessage = response.data.message;

        // Check if the user is in the Karma blacklist
        if (karmaStatus === 'success' && karmaMessage === 'Identity not found in karma') {
            const token = await onboardUser(email, password);
            return res.status(201).json({ message: 'User registered successfully', token });
        } else {
            return res.status(400).json({ message: 'User is blacklisted and cannot be onboarded', error: response.data });
        }
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 404 && data.message === 'Identity not found in karma') {
                try {
                    const token = await onboardUser(email, password);
                    return res.status(201).json({ message: 'User registered successfully', token });
                } catch (onboardError:any) {
                    return res.status(400).json({ message: onboardError.message });
                }
            }

            return res.status(status).json({ message: 'Error checking Karma blacklist', error: data });
        }

        console.error('Error:', error.message);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
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
