import { Request, Response, NextFunction } from "express";
import { AdminUserService } from "../../services/admin/user.service";
import { UpdateUserDTO } from "../../dtos/user.dto";
import { BASE_URL } from "../../config";
import z from "zod";

const adminUserService = new AdminUserService();

export class AdminUserController {
    // POST /api/admin/users - Create user
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body;

            // Add image URL if uploaded
            if (req.file) {
                userData.profileImage = req.file.filename;
            }

            const newUser = await adminUserService.createUser(userData);

            // Format response with full image URL
            let profileImageUrl = null;
            if (newUser.profileImage) {
                profileImageUrl = `${BASE_URL}/uploads/profiles/${newUser.profileImage}`;
            }

            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: {
                    ...newUser.toObject(),
                    profileImage: profileImageUrl
                }
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    // GET /api/admin/users - Get all users
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await adminUserService.getAllUsers();

            // Format all users with full image URLs
            const formattedUsers = users.map((user: any) => {
                let profileImageUrl = null;
                if (user.profileImage) {
                    profileImageUrl = `${BASE_URL}/uploads/profiles/${user.profileImage}`;
                }
                return {
                    ...user.toObject(),
                    profileImage: profileImageUrl
                };
            });

            return res.status(200).json({
                success: true,
                data: formattedUsers,
                message: "All users retrieved successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    // GET /api/admin/users/:id - Get single user
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const user = await adminUserService.getUserById(userId);

            let profileImageUrl = null;
            if ((user as any).profileImage) {
                profileImageUrl = `${BASE_URL}/uploads/profiles/${(user as any).profileImage}`;
            }

            return res.status(200).json({
                success: true,
                data: {
                    ...(user as any).toObject(),
                    profileImage: profileImageUrl
                },
                message: "User retrieved successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    // PUT /api/admin/users/:id - Update user
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const parsedData = UpdateUserDTO.safeParse(req.body);

            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsedData.error.format()
                });
            }

            const updateData = parsedData.data;

            // Add image if uploaded
            if (req.file) {
                updateData.profileImage = req.file.filename;
            }

            const updatedUser = await adminUserService.updateUser(userId, updateData);

            let profileImageUrl = null;
            if ((updatedUser as any).profileImage) {
                profileImageUrl = `${BASE_URL}/uploads/profiles/${(updatedUser as any).profileImage}`;
            }

            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: {
                    ...(updatedUser as any).toObject(),
                    profileImage: profileImageUrl
                }
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    // DELETE /api/admin/users/:id - Delete user
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const deleted = await adminUserService.deleteUser(userId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}