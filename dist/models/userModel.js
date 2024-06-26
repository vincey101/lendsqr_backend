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
class UserModel {
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.default)('users').insert(user);
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)('users').where({ id: userId }).first();
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.default)('users').where({ email }).first();
        });
    }
    static userExists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, db_1.default)('users').where({ id: userId }).first();
            return !!user;
        });
    }
    static updateBalance(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.default)('users')
                .where({ id: userId })
                .increment('balance', amount);
        });
    }
    static transferFunds(fromUserId, toUserId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const fromUser = yield trx('users').where({ id: fromUserId }).first();
                const toUser = yield trx('users').where({ id: toUserId }).first();
                if (!fromUser || !toUser) {
                    throw new Error('User not found');
                }
                if (fromUser.balance === undefined || fromUser.balance < amount) {
                    throw new Error('Insufficient funds');
                }
                yield trx('users').where({ id: fromUserId }).decrement('balance', amount);
                yield trx('users').where({ id: toUserId }).increment('balance', amount);
            }));
        });
    }
    static deductBalance(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, db_1.default)('users').where({ id: userId }).first();
            if (!user) {
                throw new Error('User not found');
            }
            if (user.balance === undefined || user.balance < amount) {
                throw new Error('Insufficient funds');
            }
            yield (0, db_1.default)('users').where({ id: userId }).decrement('balance', amount);
        });
    }
}
exports.default = UserModel;
