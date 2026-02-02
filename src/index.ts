import express from "express";
import cors from "cors";
import { connectDB } from "./database/mongodb";
import authRoutes from "./routes/auth.route";
import restaurantRoutes from "./routes/restaurant.route";
import foodRoutes from "./routes/food.route";
import orderRoutes from "./routes/order.route";
import path from "path";
import { PORT } from "./config";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.get("/", (req, res) => {
    res.json({ message: "Foodify Auth API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);


const start = async () => {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

start();