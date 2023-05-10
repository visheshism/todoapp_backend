import express from "express";
import { createUser, deleteUser, getUserDetails, updateProp, userLogin, logoutUser, userConfirmationMail, confirmUser } from "../controllers/user.js";
import { alreadyLoggedIn, isAuthenticated, setCookie } from "../middlewares/auth.js";

const UserRouter = express.Router()

UserRouter.post("/register", alreadyLoggedIn, createUser)

UserRouter.post("/login", alreadyLoggedIn, userLogin, setCookie)

UserRouter.put("/update", isAuthenticated, updateProp)

UserRouter.get("/logout", isAuthenticated, logoutUser)

UserRouter.get("/confirm", confirmUser)

UserRouter.get("/confirm_email", userConfirmationMail)

UserRouter.route("/me").get(isAuthenticated, getUserDetails).delete(isAuthenticated, deleteUser)

export default UserRouter