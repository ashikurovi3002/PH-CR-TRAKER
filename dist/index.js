"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const path_1 = __importDefault(require("path"));
const app_1 = __importDefault(require("./app"));
const dev = process.env.NODE_ENV !== 'production';
const nextApp = (0, next_1.default)({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;
nextApp.prepare().then(async () => {
    // Serve uploaded files statically
    app_1.default.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'uploads')));
    // Let Next.js handle all other routes
    app_1.default.use((req, res) => {
        return handle(req, res);
    });
    app_1.default.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error starting server', err);
    process.exit(1);
});
