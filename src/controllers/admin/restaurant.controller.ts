import { Request, Response } from "express";
import { RestaurantModel } from "../../models/Restaurant.model";
import { BASE_URL } from "../../config";
import path from "path";
import fs from "fs";

export class AdminRestaurantController {

    async getAllRestaurants(req: Request, res: Response) {
        try {
            const { page = "1", size = "10", search } = req.query as any;
            const pageNum = parseInt(page);
            const pageSize = parseInt(size);
            const query = search
                ? { name: { $regex: search, $options: "i" } }
                : {};

            const [restaurants, total] = await Promise.all([
                RestaurantModel.find(query)
                    .skip((pageNum - 1) * pageSize)
                    .limit(pageSize)
                    .sort({ createdAt: -1 }),
                RestaurantModel.countDocuments(query),
            ]);

            const formatted = restaurants.map((r) => ({
                ...r.toObject(),
                image: r.image ? `${BASE_URL}/uploads/restaurants/${r.image}` : null,
            }));

            return res.status(200).json({
                success: true,
                data: formatted,
                pagination: {
                    page: pageNum,
                    size: pageSize,
                    totalItems: total,
                    totalPages: Math.ceil(total / pageSize),
                },
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getRestaurantById(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantModel.findById(req.params.id);
            if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
            return res.status(200).json({
                success: true,
                data: {
                    ...restaurant.toObject(),
                    image: restaurant.image ? `${BASE_URL}/uploads/restaurants/${restaurant.image}` : null,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async createRestaurant(req: Request, res: Response) {
        try {
            const data = { ...req.body };
            if (req.file) data.image = req.file.filename;
            if (data.categories && typeof data.categories === "string") {
                data.categories = data.categories.split(",").map((c: string) => c.trim()).filter(Boolean);
            }
            if (!data.image) return res.status(400).json({ success: false, message: "Restaurant image is required" });

            const restaurant = await RestaurantModel.create(data);
            return res.status(201).json({
                success: true,
                message: "Restaurant created",
                data: {
                    ...restaurant.toObject(),
                    image: `${BASE_URL}/uploads/restaurants/${restaurant.image}`,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantModel.findById(req.params.id);
            if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

            const data = { ...req.body };
            if (req.file) {
                // Delete old image
                if (restaurant.image) {
                    const oldPath = path.join(__dirname, "../../../uploads/restaurants", restaurant.image);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                data.image = req.file.filename;
            }
            if (data.categories && typeof data.categories === "string") {
                data.categories = data.categories.split(",").map((c: string) => c.trim()).filter(Boolean);
            }

            const updated = await RestaurantModel.findByIdAndUpdate(req.params.id, data, { new: true });
            return res.status(200).json({
                success: true,
                message: "Restaurant updated",
                data: {
                    ...updated!.toObject(),
                    image: updated!.image ? `${BASE_URL}/uploads/restaurants/${updated!.image}` : null,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantModel.findById(req.params.id);
            if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

            if (restaurant.image) {
                const imgPath = path.join(__dirname, "../../../uploads/restaurants", restaurant.image);
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            }

            await RestaurantModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: "Restaurant deleted" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}