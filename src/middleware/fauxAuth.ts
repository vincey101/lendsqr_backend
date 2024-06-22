import { Request, Response, NextFunction } from 'express';
import TokenModel from '../models/tokenModel';

export const generateToken = async (email: string): Promise<string> => {
    const token = `token-${new Date().getTime()}`;
    await TokenModel.createToken(token, email);
    return token;
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'] as string;

    if (token) {
        const email = await TokenModel.getToken(token);
        if (email) {
            req.body.email = email;
            return next();
        }
    }

    res.status(401).json({ message: 'Unauthorized' });
};
