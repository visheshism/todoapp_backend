import { ADMIN_ARR } from "../data/env.js";
import { Todo, AdminTodo } from "../models/todo.js";

export const calculateIsAdmin = (currentUserEmail) => {
    const isAdmin = JSON.parse(ADMIN_ARR).includes(currentUserEmail)
    return isAdmin
}

export const setModel = (req, res, next) => {
    req.TodoModel = req.adminStatus ? AdminTodo : Todo

    next()
}