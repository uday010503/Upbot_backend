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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const urlRouter_1 = __importDefault(require("./router/urlRouter"));
const statsRouter_1 = __importDefault(require("./router/statsRouter"));
const monitoringServices_1 = require("./services/monitoringServices");
const node_cron_1 = __importDefault(require("node-cron"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Add debug middleware to log all requests
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl
    });
    next();
});
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/urls", urlRouter_1.default);
app.use("/api/v1/stats", statsRouter_1.default);
node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running URL checks...');
    try {
        const count = yield monitoringServices_1.monitoringService.checkAllUrls();
        console.log(`Checked ${count} URLs`);
    }
    catch (error) {
        console.error('Error during URL checks:', error);
    }
}));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.listen(process.env.PORT, () => {
    (0, db_1.connectDB)();
    console.log(`server is running on port ${process.env.PORT}`);
});
