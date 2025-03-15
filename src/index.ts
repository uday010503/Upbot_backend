import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req,res)=>{
    res.send("server is running")
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})