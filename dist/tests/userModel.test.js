"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const userModel_1 = __importDefault(require("../models/userModel"));
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
    it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { email: 'test@example.com', password: 'password' };
        yield userModel_1.default.createUser(user);
        expect((0, db_1.default)().insert).toHaveBeenCalledWith(user);
    }));
    it('should get a user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 1;
        yield userModel_1.default.getUserById(userId);
        expect((0, db_1.default)().where).toHaveBeenCalledWith({ id: userId });
        expect((0, db_1.default)().first).toHaveBeenCalled();
    }));
    it('should get a user by email', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = 'test@example.com';
        yield userModel_1.default.getUserByEmail(email);
        expect((0, db_1.default)().where).toHaveBeenCalledWith({ email });
        expect((0, db_1.default)().first).toHaveBeenCalled();
    }));
    it('should check if a user exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 1;
        yield userModel_1.default.userExists(userId);
        expect((0, db_1.default)().where).toHaveBeenCalledWith({ id: userId });
        expect((0, db_1.default)().first).toHaveBeenCalled();
    }));
    it('should fund user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 1;
        const amount = 100;
        yield userModel_1.default.updateBalance(userId, amount);
        expect((0, db_1.default)().where).toHaveBeenCalledWith({ id: userId });
        expect((0, db_1.default)().increment).toHaveBeenCalledWith('balance', amount);
    }));
    it('should deduct user balance', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 1;
        const amount = 50;
        const user = { id: userId, balance: 100 };
        (0, db_1.default)().where.mockReturnValueOnce({
            first: jest.fn().mockResolvedValueOnce(user),
        });
        yield userModel_1.default.deductBalance(userId, amount);
        expect((0, db_1.default)().where).toHaveBeenCalledWith({ id: userId });
        expect((0, db_1.default)().decrement).toHaveBeenCalledWith('balance', amount);
    }));
});
