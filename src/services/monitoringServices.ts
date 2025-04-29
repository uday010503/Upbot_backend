import axios from 'axios';
import mongoose from 'mongoose'
import { IUrl, UrlCheckResult } from '../types';
import UrlHistory from '../models/UrlHistory';
import Url from "../models/UrlModel"
import User from "../models/UserModel"
import { notificationService } from './notificationService';

class MonitoringService {
    private timeout: number;
    private batchSize: number;

    constructor(timeout = 10000, batchSize = 10) {
        this.timeout = timeout
        this.batchSize = batchSize
    }

    async checkUrl(url: IUrl) {
        const startTime = Date.now()
        let isHealthy = true;
        let status = 0
        let errorMessage = ""

        try {
            const response = await axios.get(url.url, {
                timeout: this.timeout,
                headers: url.headers ? Object.fromEntries(url.headers) : {}
            })
            status = response.status
            isHealthy = response.status === 200

        } catch (err: any) {
            isHealthy = false;
            errorMessage = err.message;
            status = err.response?.status || 500;
        }

        const responseTime = Date.now() - startTime;

        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();


        try {
            const history = await UrlHistory.create([{
                urlId: url._id,
                timestamp: new Date(),
                status,
                responseTime,
                isHealthy,
                errorMessage
            }], { session })

            const updates = {
                lastStatus: status,
                lastChecked: new Date(),
                isHealthy,
                lastError: errorMessage || null
            }

            await Url.findByIdAndUpdate({
                _id: url._id,
                updates
            })

            await session.commitTransaction();

            return {
                urlId: url._id,
                update: updates,
                history: {
                    status: history[0].status,
                    responseTime: history[0].responseTime,
                    isHealthy: history[0].isHealthy,
                    errorMessage: history[0].errorMessage || null
                }
            };


        } catch (err) {
            await session.abortTransaction()
            throw err
        } finally {
            session.endSession();
        }
    }


    async processBatch(urls: IUrl[]) {
        const results = await Promise.all(
            urls.map(url => this.checkUrl(url))
        )

        for (const result of results) {

            if (!result.update.isHealthy) {
                const url = await Url.findById(result.urlId);
                if (url) {
                    const user = await User.findById(url.userId);
                    if (user) {
                        await notificationService.sendNotifications(user, {
                            urlName: url.name,
                            url: url.url,
                            status: result.update.lastStatus,
                            errorMessage: result.update.lastError || undefined,
                            timestamp: new Date()
                        });
                    }
                }
            }
        }
    }

    async checkAllUrls() {
        let processedCount = 0;
        let hasMore = true;

        while (hasMore) {
            const urls = await Url.find({
                isActive: true,
                $or: [
                    { lastChecked: { $exists: false } },
                    { lastChecked: { $lt: new Date(Date.now() - 30 * 60 * 1000) } }
                ]
            }).limit(this.batchSize)

            if (urls.length === 0) {
                hasMore = false;
                continue;
            }

            await this.processBatch(urls);
            processedCount += urls.length;
        }

        return processedCount
    }
}


export const monitoringService = new MonitoringService();