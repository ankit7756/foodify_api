import express from "express";
import {
    getAllRestaurants,
    getRestaurantById,
    searchRestaurants,
} from "../controllers/restaurant.controller";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/search", searchRestaurants);
router.get("/:id", getRestaurantById);

export default router;