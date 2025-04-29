import mongoose from "mongoose";
import { IUser } from "../types/index"


const UserSchema = new mongoose.Schema<IUser>({
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    }
},
{
    timestamps : true,
    collection : 'users'
})

export default mongoose.model('User',UserSchema);


