import knex from '../database/db';

class TokenModel {
    static async createToken(token: string, email: string): Promise<void> {
        await knex('tokens').insert({ token, email });
    }

    static async getToken(token: string): Promise<string | undefined> {
        const result = await knex('tokens').where({ token }).first();
        return result ? result.email : undefined;
    }

    static async deleteToken(token: string): Promise<void> {
        await knex('tokens').where({ token }).del();
    }
}

export default TokenModel;
