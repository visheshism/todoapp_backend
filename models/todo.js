import { currentDateTime } from "../utils/features.js";
import mongoose from "mongoose";

const commonProps = {
    type: String,
    required: true,
}

const schema = new mongoose.Schema({
    title: {
        ...commonProps,
        maxLength: 80,
    },
    description: {
        ...commonProps,
        maxLength: 400,
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    meIty: {
        ...commonProps,
        immutable: true,
        unique: true,
        lowercase: true,
    },
    userIty: {
        ...commonProps,
        immutable: true,
        lowercase: true,
    },
    categ: {
        ...commonProps,
        lowercase: true,
    },
    createdAt: {
        ...commonProps,
        default: currentDateTime(),
        immutable: true,
    },
    modifiedAt: {
        ...commonProps,
        default: currentDateTime(),
    }
})

export const Todo = mongoose.model("Todos", schema, "todos")