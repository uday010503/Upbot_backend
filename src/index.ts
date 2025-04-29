import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db"
import cors from "cors"
import authRouter from "./router/authRouter"
import urlRouter from "./router/urlRouter"
import statsRouter from "./router/statsRouter"
import { monitoringService } from "./services/monitoringServices"
import cron from "node-cron"
import { auth } from "./middelwares/auth"

const app = express();
dotenv.config();
app.use(express.json())
app.use(cors())

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

app.use("/api/v1/auth",  authRouter)
app.use("/api/v1/urls", urlRouter)
app.use("/api/v1/stats", statsRouter)


cron.schedule('*/10 * * * *', async () => {
    console.log('Running URL checks...');
    try {
        const count = await monitoringService.checkAllUrls();
        console.log(`Checked ${count} URLs`);
    } catch (error) {
        console.error('Error during URL checks:', error);
    }
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`server is running on port ${process.env.PORT}`);
})