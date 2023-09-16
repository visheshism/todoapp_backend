import { generateUniqueNumbers } from "../utils/features.js";
import mongoose from "mongoose";

const commonProps = {
    type: String,
    required: true,
}

const schema = mongoose.Schema({
    attemptsLeft: {
        max: 3,
        min: 0,
        default: 3,
        type: Number,
        required: true,
    },
    userIty: {
        ...commonProps,
    },
    expiryTime: {
        ...commonProps,
        default: Date.now() + (60 * 60 * 1000),
    },
    oneTimePassword: {
        ...commonProps,
    }
})

schema.methods.setOtp = async function () {
    this.oneTimePassword = generateUniqueNumbers(4)
    this.attemptsLeft -= 1
    this.expiryTime = Date.now() + (60 * 60 * 1000)
    return await this.save({ new: true })
}

export const resetPassword = mongoose.model("reset_pass", schema, "resetPassword")