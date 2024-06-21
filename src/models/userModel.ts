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


    
}

export default UserModel;
