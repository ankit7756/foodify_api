import { UserModel } from "../models/User.model";

export const getUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email });
};

export const getUserByUsername = async (username: string) => {
    return await UserModel.findOne({ username });
};

export const createUser = async (userData: any) => {
    const user = new UserModel(userData);
    return await user.save();
};

// 🆕 ADD THESE METHODS
export const getUserById = async (id: string) => {
    return await UserModel.findById(id);
};

export const getAllUsers = async () => {
    return await UserModel.find().select("-password");
};

export const updateUser = async (id: string, updateData: any) => {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

export const deleteUser = async (id: string) => {
    const result = await UserModel.findByIdAndDelete(id);
    return result ? true : false;
};