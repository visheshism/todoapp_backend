import { errHandler } from "../middlewares/error.js";
import { Categ } from "../models/category.js";
import { Todo } from "../models/todo.js";
import { SearchQuery } from "../models/search_query.js";
import { genTodoIty, currentDateTime } from "../utils/features.js";

export const createTodo = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const meIty = genTodoIty()
        const { title, description, categ } = req.body
        const ifTodoExists = await Todo.findOne({ meIty, userIty })

        if (ifTodoExists) return next(new errHandler("Todo already exists with the given data", 404))

        const createNewTodo = !ifTodoExists && await Todo.create({ title, description, userIty, meIty, categ, })

        const todo = createNewTodo && await Todo.findOne({ meIty }).select({ _id: 0, __v: 0, createdAt: 0, modifiedAt: 0, userIty: 0 })
        res.status(200).json({ success: true, todo })
    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const getTodo = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { Ity: meIty } = req.body
        const todo = await Todo.findOne({ meIty, userIty }).select({ _id: 0, __v: 0, createdAt: 0, modifiedAt: 0, userIty: 0 })

        if (!todo) return next(new errHandler("No todo Found !", 404))

        res.status(200).json({ success: true, todo })
    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const updateTodo = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { updatedTodo } = req.body
        const { Ity: meIty } = updatedTodo
        const todo = await Todo.findOneAndUpdate({ meIty, userIty }, { ...updatedTodo, modifiedAt: currentDateTime() }, { new: true }).select({ _id: 0, __v: 0, createdAt: 0, modifiedAt: 0, userIty: 0 })

        if (!todo) return next(new errHandler("Couldn't find a Todo with the given data", 404))

        res.status(200).json({ success: true, todo })
    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const deleteTodo = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { Ity: meIty } = req.body
        const todo = await Todo.findOne({ meIty, userIty })
        if (!todo) return next(new errHandler("Couldn't find a Todo with the given data", 404))

        await todo.deleteOne()

        res.status(200).json({ success: true, message: "Todo deleted !" })
    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const getAllTodos = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const todos = await Todo.find({ userIty }).select({ _id: 0, __v: 0, createdAt: 0, modifiedAt: 0, userIty: 0 })

        if (!todos || todos.length == 0) return next(new errHandler("Couldn't find any Todos !", 404))

        res.status(200).json({ success: true, todos })

    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const getAllByCateg = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { categ_name: categ } = req.params
        const categDocument = await Categ.findOne({ userIty })

        if (!categDocument || !categDocument.categs.includes(categ)) return next(new errHandler("Category doesn't exist", 400))

        const todos = await Todo.find({ userIty, categ }).select({ _id: 0, __v: 0, createdAt: 0, modifiedAt: 0, userIty: 0 })

        if (!todos || todos.length == 0) return next(new errHandler("Couldn't find any Todos !", 404))

        res.status(200).json({ success: true, todos })

    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const deleteAllByCateg = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { categ_name: categ } = req.params

        const categDocument = await Categ.findOne({ userIty })

        if (!categDocument || !categDocument.categs.includes(categ)) return next(new errHandler("Category doesn't exist", 400))

        const todos = await Todo.find({ userIty, categ })

        if (!todos || todos.length == 0) return next(new errHandler("Couldn't find any Todos !", 404))

        await Todo.deleteMany({ userIty, categ })
        res.status(200).json({ success: true, message: "Deleted todos !" })

    } catch (error) {
        next(new errHandler(error.message, 400))
    }
}

export const searchTodos = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { query, categ } = req.query
        if (!query) return next(new errHandler("Query parameter is needed to make a search"))

        const findTodos = await Todo.find({
            userIty,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ],
            ...(categ ? { categ } : {})
        })
            .select({ _id: 0, __v: 0, createdAt: 0, modifiedAt: 0, userIty: 0 })

        if (!findTodos || findTodos.length === 0) return next(new errHandler(categ && `Couldn't find any Todos with category ${categ}` || "Couldn't find any Todos"))

        await SearchQuery.addSearch(userIty, query)
        res.status(200).json({ success: true, todos: findTodos })
    } catch (error) {
        next(new errHandler(error.message))
    }
}

export const recentlySearchedTodos = async (req, res, next) => {
    try {
        const userIty = req.Ity
        const { number } = req.query
        const isExists = await SearchQuery.findOne({ userIty })
        if (!isExists || isExists.searchQuery.length === 0) return next(new errHandler("No searches were made by this user."))

        if (!number) return res.status(200).json({ success: true, recentSearches: isExists.searchQuery.slice(0, 5) })

        const parsedNumber = parseInt(number)
        if (isNaN(parsedNumber) || parsedNumber <= 0) return next(new errHandler("Invalid number parameter."))

        res.status(200).json({
            success: true,
            ...(parsedNumber > isExists.searchQuery.length && {
                message: `Could not find ${parsedNumber} searches. Here are the available recent searches:`,
            }),
            recentSearches: isExists.searchQuery.slice(0, parsedNumber),
        })
    } catch (error) {
        next(new errHandler(error.message))
    }
}