import knex from '../database/db';
import UserModel from '../models/userModel';

jest.mock('../database/db', () => {
    const mKnex = {
        insert: jest.fn(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        increment: jest.fn().mockReturnThis(),
        decrement: jest.fn().mockReturnThis(),
        transaction: jest.fn().mockImplementation((callback) => {
            return callback({
                where: jest.fn().mockReturnThis(),
                first: jest.fn(),
                decrement: jest.fn().mockReturnThis(),
                increment: jest.fn().mockReturnThis(),
            });
        }),
    };
    return jest.fn(() => mKnex);
});


describe('UserModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a user', async () => {
        const user = { email: 'test@example.com', password: 'password' };
        await UserModel.createUser(user);
        expect(knex().insert).toHaveBeenCalledWith(user);
    });


});

