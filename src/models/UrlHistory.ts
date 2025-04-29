import mongoose from "mongoose"
import { IUrlHistory } from "../types"

const UrlHistorySchema = new mongoose.Schema<IUrlHistory>({
    urlId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Url",
        require : true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    isHealthy: {
        type: Boolean,
        required: true
    },
    errorMessage: {
        type: String
    }
})

UrlHistorySchema.index({ urlId: 1, timestamp: -1 })
UrlHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

export default mongoose.model('UrlHistory', UrlHistorySchema)