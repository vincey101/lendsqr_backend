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

    it('should get a user by id', async () => {
        const userId = 1;
        await UserModel.getUserById(userId);
        expect(knex().where).toHaveBeenCalledWith({ id: userId });
        expect(knex().first).toHaveBeenCalled();
    });

    it('should get a user by email', async () => {
        const email = 'test@example.com';
        await UserModel.getUserByEmail(email);
        expect(knex().where).toHaveBeenCalledWith({ email });
        expect(knex().first).toHaveBeenCalled();
    });

    it('should check if a user exists', async () => {
        const userId = 1;
        await UserModel.userExists(userId);
        expect(knex().where).toHaveBeenCalledWith({ id: userId });
        expect(knex().first).toHaveBeenCalled();
    });
    

    it('should fund user', async () => {
        const userId = 1;
        const amount = 100;
        await UserModel.updateBalance(userId, amount);
        expect(knex().where).toHaveBeenCalledWith({ id: userId });
        expect(knex().increment).toHaveBeenCalledWith('balance', amount);
    });

});


