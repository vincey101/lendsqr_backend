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
exports.validateToken = exports.generateToken = void 0;
const tokenModel_1 = __importDefault(require("../models/tokenModel"));
const generateToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = `token-${new Date().getTime()}`;
    yield tokenModel_1.default.createToken(token, email);
    return token;
});
exports.generateToken = generateToken;
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['authorization'];
    if (token) {
        const email = yield tokenModel_1.default.getToken(token);
        if (email) {
            req.body.email = email;
            return next();
        }
    }
    res.status(401).json({ message: 'Unauthorized' });
});
exports.validateToken = validateToken;
