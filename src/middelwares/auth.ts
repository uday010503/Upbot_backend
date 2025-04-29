import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const auth: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', "");
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { userId: string };
        req.user = { userId: decoded.userId };
        console.log("auth done")
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};