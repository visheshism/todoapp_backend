import mongoose from "mongoose";
import { currentDateTime } from "../utils/features.js";

const commonProps = {
    type: String,
    required: true,
}

const schema = mongoose.Schema({
    name: {
        ...commonProps,
        set: function (value) {
            const words = value.split(' ');
            const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            return capitalizedWords.join(' ');
        },
    },
    email: {
        ...commonProps,
        unique: true,
        immutable: true,
        lowercase: true,
        trim: true,
    },
    password: {
        ...commonProps,
        select: false,
    },
    userIty: {
        ...commonProps,
        immutable: true,
        lowercase: true,
    },
    lastLoggedIn: {
        ...commonProps,
        default: currentDateTime()
    },
    confirmed: {
        type: Boolean,
        required: true,
        default: false,
    }
})

export const User = mongoose.model("Users", schema, "users")