"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const fauxAuth_1 = require("../middleware/fauxAuth");
const router = (0, express_1.Router)();
router.post('/register', userController_1.register);
router.post('/fund', fauxAuth_1.validateToken, userController_1.fundAccount);
router.post('/transfer', fauxAuth_1.validateToken, userController_1.transfer);
router.post('/withdraw', fauxAuth_1.validateToken, userController_1.withdraw);
exports.default = router;
