import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import { RegisterInput, LoginInput } from "../types/user.type";
import { JWT_SECRET } from "../config";

export const registerUser = async (data: RegisterInput) => {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
        throw new HttpError(400, "Email already exists");
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const newUser = await createUser({
        fullName: data.fullName,
        username: data.username,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        role: "user"
    });

    return {
        message: "User registered successfully",
        user: {
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            phone: newUser.phone,
            email: newUser.email,
            role: newUser.role
        }
    };
};

export const loginUser = async (data: LoginInput) => {
    const user = await getUserByEmail(data.email);
    if (!user) {
        throw new HttpError(401, "Invalid email or password");
    }

    const isValid = await bcryptjs.compare(data.password, user.password);
    if (!isValid) {
        throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "Login successful",
        token,
        user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            phone: user.phone,
            email: user.email,
            role: user.role
        }
    };
};