import { currentDateTime } from "../utils/features.js";
import mongoose from "mongoose";

const commonProps = {
    type: String,
    required: true,
}

const baseSchema = {
    title: {
        ...commonProps,
        maxLength: 80,
    },
    description: {
        type: String,
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
}

const schema = new mongoose.Schema({
    ...baseSchema
})

const adminSchema = new mongoose.Schema({
    ...baseSchema,
    title: {
        ...baseSchema.title,
        maxLength: 120,
    },
    description: {
        ...baseSchema.description,
        maxLength: 700,
    }
})

export const Todo = mongoose.model("Todos", schema, "todos")
export const AdminTodo = mongoose.model("Todos", adminSchema, "todos")