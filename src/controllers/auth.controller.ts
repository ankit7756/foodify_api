import { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "../types/user.type";
import { registerUser, loginUser } from "../services/user.service";
import { UserModel } from "../models/User.model";
import { BASE_URL } from "../config";
import path from "path";
import fs from "fs";

export const register = async (req: Request, res: Response) => {
    const result = RegisterSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.format(),
        });
    }

    try {
        const data = await registerUser(result.data);
        res.status(201).json({ success: true, ...data });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.format(),
        });
    }

    try {
        const data = await loginUser(result.data);
        res.json({ success: true, ...data });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await UserModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🆕 Dynamic base URL
        let profileImageUrl = null;
        if (user.profileImage) {
            profileImageUrl = `${BASE_URL}/uploads/profiles/${user.profileImage}`;
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                profileImage: profileImageUrl,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { fullName, username, phone } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (username) user.username = username;
        if (phone) user.phone = phone;

        // Handle profile image update
        if (req.file) {
            // Delete old image if exists
            if (user.profileImage) {
                const oldImagePath = path.join(__dirname, "../../uploads/profiles", user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            user.profileImage = req.file.filename;
        }

        await user.save();

        // 🆕 Dynamic base URL
        let profileImageUrl = null;
        if (user.profileImage) {
            profileImageUrl = `${BASE_URL}/uploads/profiles/${user.profileImage}`;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                profileImage: profileImageUrl,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};