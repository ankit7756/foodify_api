import { UserModel } from "../models/User.model";

export const getUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email });
};

export const createUser = async (userData: any) => {
    const user = new UserModel(userData);
    return await user.save();
};