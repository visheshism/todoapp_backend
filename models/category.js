import mongoose from "mongoose";

const schema = mongoose.Schema({
    userIty: {
        type: String,
        required: true,
        immutable: true,
        lowercase: true,
    },
    categs: {
        type: Array,
        required: true,
    }
})

export const Categ = mongoose.model("Categs", schema, "categs")