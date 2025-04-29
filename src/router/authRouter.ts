import express, { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AuthRequest } from "../middelwares/auth";

const router = express.Router()
router.post("/register", async(req : any , res : any) => {

    const { email, password } = req.body

    try {

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({ email, password: hashedPassword })

        return res.status(200).json({
            message: "User Registered Successfully",
            user
        })
    } catch (err) {

        return res.status(400).json({ message: "Register failed" })
    }
});



router.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET || "";

    try {
        const user = await User.findOne({ email });
        console.log("hi");
        if (!user || !user.password) {
            return res.status(400).json({ message: "User not found or invalid password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "invalid password"
            });
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, JWT_SECRET);
        console.log(token);

        return res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (e) {
        return res.status(400).json({ message: "Login failed" });
    }
});




export default router;