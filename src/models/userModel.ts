import knex from '../database/db';

interface User {
    id?: number;
    email: string;
    password: string;
    balance?: number;
}

class UserModel {
    static async createUser(user: User): Promise<void> {
        await knex('users').insert(user);
    }

    static async getUserById(userId: number): Promise<User | undefined> {
        return await knex('users').where({ id: userId }).first();
    }
    
    static async getUserByEmail(email: string): Promise<User | undefined> {
        return await knex('users').where({ email }).first();
    }


    static async userExists(userId: number): Promise<boolean> {
        const user = await knex('users').where({ id: userId }).first();
        return !!user;
    }

    static async updateBalance(userId: number, amount: number): Promise<void> {
        await knex('users')
            .where({ id: userId })
            .increment('balance', amount);
    }

    static async transferFunds(fromUserId: number, toUserId: number, amount: number): Promise<void> {
        await knex.transaction(async trx => {
            const fromUser = await trx('users').where({ id: fromUserId }).first();
            const toUser = await trx('users').where({ id: toUserId }).first();

            if (!fromUser || !toUser) {
                throw new Error('User not found');
            }

            if (fromUser.balance === undefined || fromUser.balance < amount) {
                throw new Error('Insufficient funds');
            }

            await trx('users').where({ id: fromUserId }).decrement('balance', amount);
            await trx('users').where({ id: toUserId }).increment('balance', amount);
        });
    }

    static async deductBalance(userId: number, amount: number): Promise<void> {
        const user = await knex('users').where({ id: userId }).first();
        if (!user) {
            throw new Error('User not found');
        }

        if (user.balance === undefined || user.balance < amount) {
            throw new Error('Insufficient funds');
        }

        await knex('users').where({ id: userId }).decrement('balance', amount);
    }
}

export default UserModel;

