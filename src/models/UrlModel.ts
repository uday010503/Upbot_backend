import mongoose from "mongoose";
import { IUrl } from "../types/index"


const UrlSchema = new mongoose.Schema<IUrl>({
    url : {
        type : String,
        require : true,
        unique : true,
        trim : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true,
    },
    name : {
        type : String,
        requre : true,
        default : "My Link",
        trim : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    headers : {
        type : Map,
        of : String,
        default : {}
    },
    isActive : {
        type :Boolean,
        default : true
    },
    isHealthy : {
        type : Boolean,
        default : true
    },
    lastChecked : {
        type : Date,
        deafult : null
    },
    lastError : {
        type : String
    }
})

UrlSchema.index({ userId : 1, isActive : 1, lastCheked : 1})
UrlSchema.index({ url : 1 , userId : 1 })
UrlSchema.index({ lastChecked: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model('Url',UrlSchema);