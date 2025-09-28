import User from "../models/user.models.js";
import { ApiError, ApiResponse } from "../utils/index.js";

export const handleRegister = async (req, res, next) => {
    try {
        // get name, email and pw from body
        const { email, password, name } = req.body;

        // validate
        if (!(email && password && name)) {
            throw new ApiError(400, "All field must be passed");
        }

        // Email format validation using regex
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Email Not Valid");
        }

        // Password validation in controller
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // check min 8 char, one uppercase, special char and number
        if (!passwordRegex.test(password)) {
            throw new ApiError(400, "Password Not Valid");
        }

        // validate if user exists
        let user = await User.findOne({ email });
        if (user) {
            throw new ApiError(400, "User already exists with this email");
        }

        // Create new user object
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        // token create
        const accessToken = await newUser.generateAccessToken();
        const refreshToken = await newUser.generateRefreshToken();

        // saving refresh token to db
        newUser.refreshToken = refreshToken;
        const savedUser = await newUser.save();

        savedUser.refreshToken = undefined;
        savedUser.password = undefined;

        // send cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        });

        // send response
        return res.status(201).json(
            new ApiResponse(201, "User Created Successfully", {
                savedUser,
            })
        );
    } catch (error) {
        console.log("Some Error Occured: ", error);
        // If the error is already an instance of ApiError, pass it to the error handler
        if (error instanceof ApiError) {
            return next(error);
        }

        // For all other errors, send a generic error message
        return next(
            new ApiError(500, "Something went wrong during registration")
        );
    }
};
