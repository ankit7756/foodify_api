import bcryptjs from "bcryptjs";
import { HttpError } from "../../errors/http-error";
import { UpdateUserInput } from "../../types/user.type";
import * as userRepo from "../../repositories/user.repository";

export class AdminUserService {
    // Create user as admin (with optional image)
    async createUser(data: any) {
        const emailCheck = await userRepo.getUserByEmail(data.email);
        if (emailCheck) {
            throw new HttpError(403, "Email already in use");
        }

        const usernameCheck = await userRepo.getUserByUsername(data.username);
        if (usernameCheck) {
            throw new HttpError(403, "Username already in use");
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(data.password, 10);

        const newUser = await userRepo.createUser({
            fullName: data.fullName,
            username: data.username,
            phone: data.phone,
            email: data.email,
            password: hashedPassword,
            role: data.role || "user",
            profileImage: data.profileImage || null
        });

        return newUser;
    }

    // Get all users
    async getAllUsers() {
        const users = await userRepo.getAllUsers();
        return users;
    }

    // Get single user by ID
    async getUserById(id: string) {
        const user = await userRepo.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    // Update any user
    async updateUser(id: string, updateData: UpdateUserInput) {
        const user = await userRepo.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        // Check email uniqueness if changing
        if (updateData.email && updateData.email !== user.email) {
            const emailExists = await userRepo.getUserByEmail(updateData.email);
            if (emailExists) {
                throw new HttpError(403, "Email already in use");
            }
        }

        // Check username uniqueness if changing
        if (updateData.username && updateData.username !== user.username) {
            const usernameExists = await userRepo.getUserByUsername(updateData.username);
            if (usernameExists) {
                throw new HttpError(403, "Username already in use");
            }
        }

        // Hash password if provided
        if (updateData.password) {
            const hashedPassword = await bcryptjs.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await userRepo.updateUser(id, updateData);
        return updatedUser;
    }

    // Delete user
    async deleteUser(id: string) {
        const user = await userRepo.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        const deleted = await userRepo.deleteUser(id);
        return deleted;
    }
}