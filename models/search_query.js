import mongoose from "mongoose";

const schema = mongoose.Schema({
    userIty: {
        type: String,
        required: true,
        immutable: true,
        lowercase: true,
    },
    searchQuery: {
        type: Array,
        required: true,
    }
})

schema.statics.addSearch = async function (Ity, query) {
    const existingDocument = await this.findOne({ userIty: Ity })

    if (existingDocument) {
        existingDocument.searchQuery.push({ query, time: Date.now() })
        await existingDocument.save()
    } else {
        const newDocument = new this({ userIty: Ity, searchQuery: [{ query, time: Date.now() }] })
        await newDocument.save()
    }
}

export const SearchQuery = mongoose.model("searchQuery", schema, "searchQuery")