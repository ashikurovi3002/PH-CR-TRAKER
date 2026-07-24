"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const ambassadorRoutes_1 = __importDefault(require("./routes/ambassadorRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({ contentSecurityPolicy: false })); // Disable CSP in dev if needed, or configure properly
app.use((0, morgan_1.default)('[:date[iso]] :method :url :status :response-time ms - :res[content-length]', {
    skip: (req) => req.url.startsWith('/_next/') || req.url.includes('favicon.ico')
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Database Connection using Prisma
prisma.$connect()
    .then(() => console.log('Prisma connected to the database successfully!'))
    .catch((err) => console.error('Error connecting to the database with Prisma:', err));
// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/ambassador', ambassadorRoutes_1.default);
app.use('/api/banners', bannerRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    let statusCode = err.statusCode || 500;
    if (err.message === 'User already exists with this email')
        statusCode = 409;
    if (err.message === 'Invalid email or password')
        statusCode = 401;
    if (err.message === 'Unauthorized')
        statusCode = 401;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message: message,
        data: null
    });
});
exports.default = app;
