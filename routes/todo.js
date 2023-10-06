import express from "express";
import { createTodo, deleteAllByCateg, deleteTodo, getAllByCateg, getAllTodos, getTodo, searchTodos, recentlySearchedTodos, updateTodo } from "../controllers/todo.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { setModel } from "../middlewares/admin.js";

const TodoRouter = express.Router()

TodoRouter.route("/todo")
    .get(isAuthenticated, setModel, getTodo)
    .post(isAuthenticated, setModel, createTodo)
    .put(isAuthenticated, setModel, updateTodo)
    .delete(isAuthenticated, setModel, deleteTodo)

TodoRouter.get("/todos/all", isAuthenticated, setModel, getAllTodos)

TodoRouter.route("/todos/:categ_name")
    .get(isAuthenticated, setModel, getAllByCateg)
    .delete(isAuthenticated, setModel, deleteAllByCateg)

TodoRouter.get("/search", isAuthenticated, setModel, searchTodos)
TodoRouter.get("/recent-searches", isAuthenticated, recentlySearchedTodos)

export default TodoRouter