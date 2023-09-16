import mongoose from "mongoose";
import { genRandom } from "../utils/features.js";

const schema = new mongoose.Schema({
    attempt: {
        max: 3,
        min: 0,
        default: 3,
        type: Number,
        required: true,
    },
    userIty: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiry_time: {
        type: String,
        required: true,
    }
})

schema.methods.setInfo = async function () {
    if (this.attempt > 0) {
        this.token = genRandom(32)
        this.expiry_time = Date.now() + (60 * 60 * 1000)
        this.attempt -= 1
        await this.save({ new: true })
    }
    return this
}

export const confirmEmail = mongoose.model("confirm_email", schema, "emailConfirmation")