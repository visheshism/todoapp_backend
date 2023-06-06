import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { errHandler } from "../middlewares/error.js";
import { Categ } from "../models/category.js";
import { Todo } from "../models/todo.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { genRandom, genUserIty,currentDateTime } from "../utils/features.js";
import { confirmEmail } from "../models/confirm_email.js";
import { sendConfirmationEmail } from "../utils/email.js";

export const createUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!password || !email || !name) return next(new errHandler("One of the field is empty", 400))

    const alreadyUser = await User.findOne({ email })
    if (alreadyUser) return next(new errHandler("User already exists", 400))
    const hashedPassword = await bcrypt.hash(password, 14)
    await User.create({ name, email, password: hashedPassword, userIty: genUserIty() })

    res.cookie("__xh_ui", "", { maxAge: 0 }).cookie("_py__lo_", "", { maxAge: 0 }).cookie("_ux__zq", "", { maxAge: 0 }).status(200).json({ success: true, message: "Successfully registered ! Please Log In" })
})

export const userLogin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!password || !email) return next(new errHandler("Please provide a password and email", 400))

    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new errHandler("User doesn't exist", 400))

    const isPassMatch = await bcrypt.compare(password, user.password)

    if (!isPassMatch) return next(new errHandler("Invalid Email or Password", 400))

    if (user.confirmed === false) return next(new errHandler("Confirm Email to Log In", 400))

    user.lastLoggedIn = currentDateTime()
    await user.save()
    req.user = user
    next()
})

export const userConfirmationMail = catchAsyncError(async (req, res, next) => {
    const { mail: email } = req.query
    const { url } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(new errHandler("Couldn't find any user with this email"))
    if (user.confirmed === true) return next(new errHandler("User is already confirmed"))
    const isExists = await confirmEmail.findOne({ userIty: user.userIty })

    if (!isExists) {
        const newConfirmEmailDoc = await confirmEmail.create({ userIty: user.userIty, token: genRandom(23), expiry_time: Date.now() + (60 * 60 * 1000) })
        sendConfirmationEmail(url, user.email, newConfirmEmailDoc.token, 0)
        return res.status(200).json({ success: true, message: "Confirmation mail sent, Check your registered email ! ", confirmEmailDoc: newConfirmEmailDoc })
    }

    const confirm_email = await isExists.setInfo({ new: true })

    if (confirm_email.attempt === 0) return next(new errHandler("Maximum attempts exceeded, please contact Administrator"))
    let message;

    confirm_email.attempt === 2 ? message = "Confirmation mail sent, One more attempt left !" : confirm_email.attempt === 1 ? message = "Confirmation mail sent, No more attempts left !" : null
    sendConfirmationEmail(url, user.email, confirm_email.token, 0, "")

    res.status(200).json({
        success: true,
        message,
    })

})

export const confirmUser = catchAsyncError(async (req, res, next) => {
    const { user: email, token } = req.query
    const { url } = req.body

    if (!email || !token) return next(new errHandler("Invalid request"))

    const user = await User.findOne({ email })
    if (!user) return next(new errHandler("Invalid User"))
    if (user.confirmed === true) return next(new errHandler("User is already confirmed"))
    const isExists = await confirmEmail.findOne({ userIty: user.userIty })

    if (!isExists) return next(new errHandler("Invalid request"))

    if (isExists && isExists.expiry_time >= Date.now()) {
        if (isExists.token !== token) return next(new errHandler("Invalid token"))

        user.confirmed = true; await user.save();
        sendConfirmationEmail(url, user.email, null, 1, user.name)

        return res.status(200).json({
            success: true,
            message: "User has been confirmed"
        })
    }
    throw new errHandler("Token is expired, place a new request or contact the Administrator")
})

export const updateProp = catchAsyncError(async (req, res, next) => {
    const { q: prop } = req.query
    const userIty = req.Ity
    const { newName, newPass } = req.body
    const user = await User.findOne({ userIty }).select("+password")
    if (!user) return next(new errHandler("User doesn't exist", 404))
    let hashedPassword;
    if (prop === "password" || prop === "name") {

        if (prop === "password") { hashedPassword = await bcrypt.hash(newPass, 14) }

        prop === "name" ? user.name = newName : prop === "password" ? user.password = hashedPassword : null
        await user.save()

        return res.status(200).json({ success: true, message: `${prop.charAt(0).toUpperCase() + prop.slice(1)} updated !` })
    }
    throw new errHandler("Invalid Request")
})

export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const user = await User.findOne({ userIty }).select("-_id -__v -userIty -lastLoggedIn")
    if (!user) return next(new errHandler("User doesn't exist", 404))

    res.status(200).json({ success: true, User: user })
})

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const user = await User.findOne({ userIty })
    if (!user) return next(new errHandler("User doesn't exist", 404))

    await Todo.deleteMany({ userIty })
    await Categ.deleteOne({ userIty })
    await User.deleteOne({ userIty, _id: user._id })
    res.cookie("__xh_ui", "", { maxAge: 0 }).cookie("_py__lo_", "", { maxAge: 0 }).cookie("_ux__zq", "", { maxAge: 0 }).status(200).json({ success: true, message: "User Deleted !" })
})

export const logoutUser = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const user = await User.findOne({ userIty })

    if (!user) return next(new errHandler("User doesn't exist", 404))
    res.cookie("__xh_ui", "", { maxAge: 0 }).cookie("_py__lo_", "", { maxAge: 0 }).cookie("_ux__zq", "", { maxAge: 0 }).status(200).json({ success: true, message: "User Logged Out !" })
})