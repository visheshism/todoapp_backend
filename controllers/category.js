import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { errHandler } from "../middlewares/error.js";
import { Categ } from "../models/category.js";
import { Todo } from "../models/todo.js";

export const createCateg = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const { categ: newCateg } = req.body
    const categDocument = await Categ.findOne({ userIty })

    if (categDocument) {
        if (categDocument.categs.includes(newCateg)) {
            return next(new errHandler("Category Already Exists", 400))
        } else {
            await categDocument.categs.push(newCateg)
            await categDocument.save()
        }
    } else {
        await Categ.create({ userIty, categs: [newCateg] })
    }

    const { categs: categories } = await Categ.findOne({ userIty }).select("-__v -_id -userIty")

    res.status(200).json({
        success: true, message: "Category Added", categories
    })
})


export const getCategs = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const categDocument = await Categ.findOne({ userIty }).select("-__v -_id -userIty")

    if (!categDocument) return next(new errHandler("No categories found !", 400))

    const { categs: categories } = categDocument

    res.status(200).json({
        success: true, categories
    })
})


export const updateCateg = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const { categ, newCateg } = req.body
    const categDocument = await Categ.findOne({ userIty })

    if (!categDocument) return next(new errHandler("No categories found !", 400))

    if (categDocument && !categDocument.categs.includes(categ)) return next(new errHandler("Category doesn't exist", 400))

    if (categDocument && categDocument.categs.includes(newCateg)) return next(new errHandler("New category already in use", 400))

    await Todo.updateMany({ userIty, categ }, { categ: newCateg })
    categDocument.categs = categDocument.categs.map(category => category === categ ? newCateg : category)

    const { categs } = await categDocument.save({ new: true })

    res.status(200).json({ success: true, message: "Category Updated", categs })
})

export const deleteCateg = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const { categ } = req.body
    const categDocument = await Categ.findOne({ userIty })

    if (!categDocument) return next(new errHandler("No categories found !", 400))

    if (categDocument && !categDocument.categs.includes(categ)) return next(new errHandler("Category doesn't exist", 400))

    await Todo.deleteMany({ userIty, categ })
    
    categDocument.categs = categDocument.categs.filter(category => category !== categ)
    const { categs } = await categDocument.save({ new: true })

    res.status(200).json({ success: true, message: "Category Deleted", categs })
})