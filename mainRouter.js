import express from "express";
import TodoRouter from "./routes/todo.js";
import CategRouter from "./routes/category.js";
import UserRouter from "./routes/user.js";
import { isAuthenticated } from "./middlewares/auth.js";

const Router = express.Router()

Router.use("/users", UserRouter)
Router.use("/categ", isAuthenticated, CategRouter)
Router.use(TodoRouter)

export default Router