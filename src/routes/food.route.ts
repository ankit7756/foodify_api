import express from "express";
import {
    getAllFoods,
    getFoodsByRestaurant,
    getFoodById,
    getPopularFoods,
} from "../controllers/food.controller";

const router = express.Router();

router.get("/", getAllFoods);
router.get("/popular", getPopularFoods);
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);
router.get("/:id", getFoodById);

export default router;