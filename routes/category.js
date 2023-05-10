import express from "express";
import { createCateg, deleteCateg, getCategs, updateCateg } from "../controllers/category.js";

const CategRouter = express.Router()

CategRouter.route("/")
    .get(getCategs)
    .post(createCateg)
    .put(updateCateg)
    .delete(deleteCateg)

export default CategRouter