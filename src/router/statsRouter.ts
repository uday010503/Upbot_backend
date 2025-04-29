import express, { Response } from "express";
import { auth, AuthRequest } from "../middelwares/auth";
import Url from "../models/UrlModel"
import UrlHistory from "../models/UrlHistory";
import { DashboardStats } from "../types";


const router = express.Router()


router.get("/dashboard", auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [
            totalUrls,
            totalActiveUrls,
            healthyUrls,
            totalChecks
        ] = await Promise.all([
            Url.countDocuments({ userId: req.user?.userId }),
            Url.countDocuments({ userId: req.user?.userId, isActive: true }),
            Url.countDocuments({ userId: req.user?.userId, isHealthy: true }),
            UrlHistory.countDocuments({ urlId: { $in: await Url.find({ userId: req.user?.userId }).distinct('_id') } })
        ])

        const stats: DashboardStats = {
            totalUrls,
            totalActiveUrls,
            healthyUrls,
            totalChecks
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
})

router.get("/history/:urlid", auth, async (req: AuthRequest, res: Response)=>{
    try {
        const url = await Url.findOne({
            _id: req.params.urlid,
            userId: req.user?.userId
        })
        if (!url) {
            res.status(404).json({ message: "URL not found" })
        }
        const History = UrlHistory.findOne({ urlId: req.params.urlId })
            .sort({ timeStamp: -1 })
            .limit(100);
        res.json({ history })
    } catch (err) {
        res.status(500).json({ error: 'Error fetching URL history' })
    }
})

export default router;