import mongoose from 'mongoose'

export async function connectDB(){
    const url = process.env.DATABASE_URL || ""
    await mongoose.connect(url) 
    console.log("Database connected");
}