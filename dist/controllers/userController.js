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
exports.withdraw = exports.transfer = exports.fundAccount = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const fauxAuth_1 = require("../middleware/fauxAuth");
const KARMA_API_KEY = process.env.KARMA_API_KEY;
const KARMA_API_URL = process.env.KARMA_API_URL;
const onboardUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield userModel_1.default.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield userModel_1.default.createUser({ email, password: hashedPassword, balance: 0 });
    const token = (0, fauxAuth_1.generateToken)(email);
    return token;
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const karmaUrl = `${KARMA_API_URL}/${encodeURIComponent(email)}`;
        const response = yield axios_1.default.get(karmaUrl, {
            headers: {
                Authorization: `Bearer ${KARMA_API_KEY}`
            }
        });
        const karmaStatus = response.data.status;
        const karmaMessage = response.data.message;
        // Check if the user is in the Karma blacklist
        if (karmaStatus === 'success' && karmaMessage === 'Identity not found in karma') {
            const token = yield onboardUser(email, password);
            return res.status(201).json({ message: 'User registered successfully', token });
        }
        else {
            return res.status(400).json({ message: 'User is blacklisted and cannot be onboarded', error: response.data });
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const data = error.response.data;
            if (status === 404 && data.message === 'Identity not found in karma') {
                try {
                    const token = yield onboardUser(email, password);
                    return res.status(201).json({ message: 'User registered successfully', token });
                }
                catch (onboardError) {
                    return res.status(400).json({ message: onboardError.message });
                }
            }
            return res.status(status).json({ message: 'Error checking Karma blacklist', error: data });
        }
        console.error('Error:', error.message);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});
exports.register = register;
const fundAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    try {
        const userExists = yield userModel_1.default.userExists(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        yield userModel_1.default.updateBalance(userId, amount);
        res.status(200).json({ message: 'Account funded successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error funding account', error: error.message });
    }
});
exports.fundAccount = fundAccount;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromUserId, toUserId, amount } = req.body;
    try {
        const fromUser = yield userModel_1.default.getUserById(fromUserId);
        const toUser = yield userModel_1.default.getUserById(toUserId);
        if (!fromUser || !toUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (fromUser.balance === undefined || fromUser.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        yield userModel_1.default.transferFunds(fromUserId, toUserId, amount);
        res.status(200).json({ message: 'Transfer successful' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error transferring funds', error: error.message });
    }
});
exports.transfer = transfer;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    try {
        const user = yield userModel_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.balance === undefined || user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        yield userModel_1.default.deductBalance(userId, amount);
        res.status(200).json({ message: 'Withdrawal successful' });
    }
    catch (error) {
        if (error.message === 'Insufficient funds') {
            res.status(400).json({ message: 'Insufficient funds' });
        }
        else if (error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(500).json({ message: 'Error withdrawing funds', error: error.message });
        }
    }
});
exports.withdraw = withdraw;
