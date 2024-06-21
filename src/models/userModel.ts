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

    static async deductBalance(userId: number, amount: number): Promise<void> {
        const user = await db('users').where('id', userId).first();
        if (!user) {
            throw new Error('User not found');
        }

        if (user.balance < amount) {
            throw new Error('Insufficient funds');
        }

        await db('users').where('id', userId).decrement('balance', amount);
    }

    static async transferFunds(fromUserId: number, toUserId: number, amount: number): Promise<void> {
        const trx = await db.transaction();

        try {
            const fromUser = await trx('users').where('id', fromUserId).first();
            const toUser = await trx('users').where('id', toUserId).first();

            if (!fromUser || !toUser) {
                throw new Error('User not found');
            }

            if (fromUser.balance < amount) {
                throw new Error('Insufficient funds');
            }

            await trx('users').where('id', fromUserId).decrement('balance', amount);
            await trx('users').where('id', toUserId).increment('balance', amount);

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
}

export default User;