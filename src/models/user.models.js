import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import constants from "../constants.js";


const userSchema = mongoose.Schema({
    fullName: {
            type: "String",
            required: [true, "Name is required"]
        },
        email: {
            type: "String",
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: "String",
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        avatar: {
            public_id: {
                type: "String",
            },
            secure_url: {
                type: "String",
            },
        },
        role: {
            type: "String",
            enum: ["USER", "TEACHER", "ADMIN"],
            default: "USER",
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
        coursesPurchased: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        refreshToken: String,
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        constants.ACCESS_TOKEN_SECRET,
        {
            expiresIn: constants.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        constants.REFRESH_TOKEN_SECRET,
        {
            expiresIn: constants.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.model("User", userSchema);

export default User;