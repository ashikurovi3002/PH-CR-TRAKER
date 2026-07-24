"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const sendResponse_1 = require("../utils/sendResponse");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyAdmin = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user || user.role !== 'admin') {
            (0, sendResponse_1.sendResponse)(res, { statusCode: 403, message: 'Forbidden: Admin access required' });
            return;
        }
        next();
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 500, message: 'Internal server error' });
    }
};
exports.verifyAdmin = verifyAdmin;
