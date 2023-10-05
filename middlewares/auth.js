import { JWT_SECRET } from "../data/env.js";
import { User } from "../models/user.js";
import { genRandom } from "../utils/features.js";
import { catchAsyncError } from "./catchAsyncError.js";
import { cookieExpiryTime as cookieMaxAge } from "../App.js";
import jwt from "jsonwebtoken";

export const setCookie = catchAsyncError((req, res, next) => {

    try {

        const { userIty: identifier } = req.user

        const __xh_ui = jwt.sign(identifier.substring(0, identifier.length / 2), JWT_SECRET) + "s$&xh%h" + genRandom(12)
        const _py__lo_ = genRandom(44)
        const _ux__zq = genRandom(12) + "e^#~y" + jwt.sign(identifier.substring(identifier.length / 2), JWT_SECRET)
        res.cookie("__xh_ui", __xh_ui, {
            maxAge: cookieMaxAge, sameSite: 'none', secure: true, httpOnly: true,
        }).cookie("_py__lo_", _py__lo_, {
            maxAge: cookieMaxAge, sameSite: 'none', secure: true, httpOnly: true,
        }).cookie("_ux__zq", _ux__zq, {
            maxAge: cookieMaxAge, sameSite: 'none', secure: true, httpOnly: true,
        }).json({ success: true, message: "Successfully Logged In" })
    } catch (error) {
        console.log(error)
    }
})

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { __xh_ui, _py__lo_, _ux__zq } = req.cookies
    if (!__xh_ui || !_py__lo_ || !_ux__zq) return res.cookie("__xh_ui", "", { maxAge: 0, sameSite: 'none', secure: true, httpOnly: true, }).cookie("_py__lo_", "", { maxAge: 0, sameSite: 'none', secure: true, httpOnly: true, }).cookie("_ux__zq", "", { maxAge: 0, sameSite: 'none', secure: true, httpOnly: true, }).status(400).json({ success: false, message: "Log In first" })

    const Ity = jwt.verify(__xh_ui.split("s$&xh%h")[0], JWT_SECRET) + jwt.verify(_ux__zq.split("e^#~y")[1], JWT_SECRET)
    const user = await User.findOne({ userIty: Ity })

    if (!user) return res.cookie("__xh_ui", "", { maxAge: 0, sameSite: 'none', secure: true, httpOnly: true }).cookie("_py__lo_", "", { maxAge: 0, sameSite: 'none', secure: true, httpOnly: true }).cookie("_ux__zq", "", { maxAge: 0, sameSite: 'none', secure: true, httpOnly: true }).status(400).json({ success: false, message: "Log In first" })

    req.Ity = Ity
    res.cookie("__xh_ui", __xh_ui, {
        maxAge: cookieMaxAge, sameSite: 'none', secure: true, httpOnly: true,
    }).cookie("_py__lo_", _py__lo_, {
        maxAge: cookieMaxAge, sameSite: 'none', secure: true, httpOnly: true,
    }).cookie("_ux__zq", _ux__zq, {
        maxAge: cookieMaxAge, sameSite: 'none', secure: true, httpOnly: true,
    })
    next()
})

export const alreadyLoggedIn = catchAsyncError(async (req, res, next) => {
    const { __xh_ui, _py__lo_, _ux__zq } = req.cookies
    if (__xh_ui && _py__lo_ && _ux__zq) {

        const Ity = jwt.verify(__xh_ui.split("s$&xh%h")[0], JWT_SECRET) + jwt.verify(_ux__zq.split("e^#~y")[1], JWT_SECRET)
        const user = await User.findOne({ userIty: Ity })

        if (user) return res.json({ success: true, message: "User already Logged In" })
    }
    next()
})
