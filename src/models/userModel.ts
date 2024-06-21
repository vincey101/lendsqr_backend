import db from '../database/db';

interface IUser {
    id?: number;
    email: string;
    password: string;
    balance?: number;
}

class User {
    static async createUser(user: IUser): Promise<void> {
        await db('users').insert(user);
    }

    static async getUserByEmail(email: string): Promise<IUser | undefined> {
        return db('users').where({ email }).first();
    }

    static async getUserById(id: number): Promise<IUser | undefined> {
        return db('users').where({ id }).first();
    }

    static async userExists(userId: number): Promise<boolean> {
        const user = await db('users').where('id', userId).first();
        return !!user;
    }

    static async updateBalance(userId: number, amount: number): Promise<void> {
        await db('users').where('id', userId).increment('balance', amount);
    }

    
}

export default User;