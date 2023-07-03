import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { errHandler } from "../middlewares/error.js";
import { Categ } from "../models/category.js";
import { Todo } from "../models/todo.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { genRandom, genUserIty, currentDateTime } from "../utils/features.js";
import { confirmEmail } from "../models/confirm_email.js";
import { resetPassword } from "../models/reset_password.js";
import { sendConfirmationEmail, sendResetPasswordEmail } from "../utils/email.js";

export const createUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!password || !email || !name) return next(new errHandler("One of the field is empty", 400))

    const alreadyUser = await User.findOne({ email })
    if (alreadyUser) return next(new errHandler("User already exists", 400))
    const hashedPassword = await bcrypt.hash(password, 14)
    await User.create({ name, email, password: hashedPassword, userIty: genUserIty() })

    res.cookie("__xh_ui", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).cookie("_py__lo_", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).cookie("_ux__zq", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).status(200).json({ success: true, message: "Successfully registered ! Please Log In" })
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
    const { mail: email, url } = req.query
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
    sendConfirmationEmail(decodeURIComponent(url), user.email, confirm_email.token, 0, "")

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

export const resetPasswordEmail = catchAsyncError(async (req, res, next) => {
    const { mail: email, url } = req.query
    const user = await User.findOne({ email })
    if (!user) return next(new errHandler("Couldn't find any user with this email"))
    const isExists = await resetPassword.findOne({ userIty: user.userIty })
    let sendOtp;
    if (!isExists) {
        const newResetPassDoc = await resetPassword.create({ userIty: user.userIty, oneTimePassword: generateUniqueNumbers(6) })
        sendOtp = await newResetPassDoc.setOtp({ new: true })
    } else {

        if (isExists.expiryTime < Date.now()) {
            isExists.expiryTime = Date.now() + (60 * 60 * 1000)
            isExists.attemptsLeft = 3
            await isExists.save()
        }

        if (isExists.attemptsLeft === 0) return next(new errHandler("Maximum attempts reached, try again in 1 hour."))

        sendOtp = await isExists.setOtp({ new: true })
    }
    sendResetPasswordEmail(user.email, sendOtp.oneTimePassword, user.name, url)

    res.status(200).json({ success: true, message: "OTP sent, Check your registered email !" })
})

export const resetPass = catchAsyncError(async (req, res, next) => {

    const { mail: email, otp: oneTimePassword } = req.query
    const { newPass } = req.body
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new errHandler("Couldn't find any user with this email."))
    const isExists = await resetPassword.findOne({ userIty: user.userIty })

    if (!isExists) return next(new errHandler("No reset-password request found for this user."))

    if (Date.now() > isExists.expiryTime) return next(new errHandler("Request timeout, kindly place a new request."))
    if (oneTimePassword !== isExists.oneTimePassword) return next(new errHandler("OTP is incorrect, please try again."))
    if (!newPass && oneTimePassword === isExists.oneTimePassword) return res.status(200).json({ success: true, message: "OTP is verified successfully!" })
    const isPassMatch = await bcrypt.compare(newPass, user.password)
    if (isPassMatch) return next(new errHandler("New password can't be same as the old one.", 400))

    const hashedPassword = await bcrypt.hash(newPass, 14)
    user.password = hashedPassword
    await user.save()

    return res.status(200).json({ success: true, message: "Password changed successfully!" })
})

export const updateProp = catchAsyncError(async (req, res, next) => {
    const { q: prop } = req.query
    const userIty = req.Ity
    const { newName, currentPass, newPass } = req.body
    const user = await User.findOne({ userIty }).select("+password")
    if (!user) return next(new errHandler("User doesn't exist", 404))
    let hashedPassword;
    if (prop === "password" || prop === "name") {

        if (prop === "password") {
            if (!currentPass || !newPass) return next(new errHandler("Current password or new password field is empty", 400))    
            const currentPassMatch = await bcrypt.compare(currentPass, user.password)
            if(!currentPassMatch) return next(new errHandler("Invalid current password, please try again.", 400))
            const isPassMatch = await bcrypt.compare(newPass, user.password)
            if (isPassMatch) return next(new errHandler("New password can't be same as the old one.", 400))    
            hashedPassword = await bcrypt.hash(newPass, 14) 
         }

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
    res.cookie("__xh_ui", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).cookie("_py__lo_", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).cookie("_ux__zq", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).status(200).json({ success: true, message: "User Deleted !" })
})

export const logoutUser = catchAsyncError(async (req, res, next) => {
    const userIty = req.Ity
    const user = await User.findOne({ userIty })
    if (!user) return next(new errHandler("User doesn't exist", 404))

     res.cookie("__xh_ui", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).cookie("_py__lo_", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).cookie("_ux__zq", "", { maxAge: 0, sameSite:'none', secure:true, httpOnly:true }).status(200).json({ success: true, message: "User Logged Out !" })
})
