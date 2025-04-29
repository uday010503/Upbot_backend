import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
}

export interface IUrl extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    url: string;
    isActive: boolean;
    checkInterval: number;
    lastChecked?: Date;
    lastStatus?: number;
    isHealthy?: boolean;
    lastError?: string;
    createdAt: Date;
    headers: Map<string, string>;
}

export interface IUrlHistory extends Document {
    _id : Types.ObjectId;
    urlId: Types.ObjectId;
    timestamp: Date;
    status: number;
    responseTime: number;
    isHealthy: boolean;
    errorMessage?: string;
}

export interface NotificationData {
    urlName: string;
    url: string;
    status: number;
    errorMessage?: string;
    timestamp: Date;
}

export interface UrlCheckResult {
    urlId: Types.ObjectId;
    update: {
        lastChecked: Date;
        lastStatus: number;
        isHealthy: boolean;
        lastError: string | null;
    };
    history: {
        status: number;
        responseTime: number;
        isHealthy: boolean;
        errorMessage: string | null;
    };
}

export interface DashboardStats {
    totalUrls: number;
    totalActiveUrls: number;
    healthyUrls: number;
    totalChecks: number;
} 