import express from "express";
import { createTodo, deleteAllByCateg, deleteTodo, getAllByCateg, getAllTodos, getTodo, searchTodos, updateTodo } from "../controllers/todo.js";
import { isAuthenticated } from "../middlewares/auth.js";

const TodoRouter = express.Router()

TodoRouter.route("/todo")
    .get(isAuthenticated, getTodo)
    .post(isAuthenticated, createTodo)
    .put(isAuthenticated, updateTodo)
    .delete(isAuthenticated, deleteTodo)

TodoRouter.get("/todos/all", isAuthenticated, getAllTodos)

TodoRouter.route("/todos/:categ_name")
    .get(isAuthenticated, getAllByCateg)
    .delete(isAuthenticated, deleteAllByCateg)

TodoRouter.get("/search", isAuthenticated, searchTodos)

export default TodoRouter