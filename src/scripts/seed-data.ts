import { RestaurantModel } from "../models/Restaurant.model";
import { FoodModel } from "../models/Food.model";
import { connectDB } from "../database/mongodb";

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await RestaurantModel.deleteMany({});
        await FoodModel.deleteMany({});

        // Create Restaurants
        const restaurants = await RestaurantModel.insertMany([
            {
                name: "Pizza Hut",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
                description: "America's favorite pizza delivery chain with a variety of pizzas, pastas, and sides.",
                rating: 4.5,
                deliveryTime: "30-40 mins",
                deliveryFee: 50,
                categories: ["Pizza", "Italian", "Fast Food"],
                address: "Kathmandu, Nepal",
                phone: "01-4567890",
                isOpen: true,
            },
            {
                name: "KFC",
                image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500",
                description: "World-famous fried chicken, burgers, and sides.",
                rating: 4.3,
                deliveryTime: "25-35 mins",
                deliveryFee: 40,
                categories: ["Chicken", "Fast Food", "American"],
                address: "Lalitpur, Nepal",
                phone: "01-4567891",
                isOpen: true,
            },
            {
                name: "Burger King",
                image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
                description: "Flame-grilled burgers, crispy fries, and refreshing beverages.",
                rating: 4.4,
                deliveryTime: "20-30 mins",
                deliveryFee: 45,
                categories: ["Burgers", "Fast Food", "American"],
                address: "Bhaktapur, Nepal",
                phone: "01-4567892",
                isOpen: true,
            },
            {
                name: "Noodles & Company",
                image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
                description: "Fresh noodles, authentic Asian flavors, and vegetarian options.",
                rating: 4.6,
                deliveryTime: "35-45 mins",
                deliveryFee: 60,
                categories: ["Noodles", "Asian", "Chinese"],
                address: "Patan, Nepal",
                phone: "01-4567893",
                isOpen: true,
            },
            {
                name: "Cafe Delight",
                image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500",
                description: "Cozy cafe serving coffee, pastries, sandwiches, and desserts.",
                rating: 4.7,
                deliveryTime: "15-25 mins",
                deliveryFee: 30,
                categories: ["Cafe", "Desserts", "Coffee"],
                address: "Thamel, Kathmandu",
                phone: "01-4567894",
                isOpen: true,
            },
        ]);

        console.log("✅ Restaurants created:", restaurants.length);

        // Create Foods for each restaurant
        const foods = [];

        // Pizza Hut Foods
        foods.push(
            {
                restaurantId: restaurants[0]._id,
                name: "Margherita Pizza",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
                description: "Classic pizza with tomato sauce, mozzarella, and fresh basil.",
                price: 600,
                category: "Pizza",
                rating: 4.6,
                isPopular: true,
            },
            {
                restaurantId: restaurants[0]._id,
                name: "Pepperoni Pizza",
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
                description: "Loaded with pepperoni slices and mozzarella cheese.",
                price: 750,
                category: "Pizza",
                rating: 4.7,
                isPopular: true,
            },
            {
                restaurantId: restaurants[0]._id,
                name: "Veggie Supreme",
                image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500",
                description: "Fresh vegetables with olive oil and herbs.",
                price: 650,
                category: "Pizza",
                rating: 4.4,
            }
        );

        // KFC Foods
        foods.push(
            {
                restaurantId: restaurants[1]._id,
                name: "Fried Chicken Bucket",
                image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
                description: "Crispy fried chicken pieces with signature spices.",
                price: 850,
                category: "Chicken",
                rating: 4.5,
                isPopular: true,
            },
            {
                restaurantId: restaurants[1]._id,
                name: "Zinger Burger",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
                description: "Spicy chicken fillet in a toasted bun.",
                price: 450,
                category: "Burger",
                rating: 4.6,
                isPopular: true,
            },
            {
                restaurantId: restaurants[1]._id,
                name: "Chicken Popcorn",
                image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500",
                description: "Bite-sized crispy chicken pieces.",
                price: 350,
                category: "Chicken",
                rating: 4.3,
            }
        );

        // Burger King Foods
        foods.push(
            {
                restaurantId: restaurants[2]._id,
                name: "Whopper",
                image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
                description: "Flame-grilled beef patty with fresh vegetables.",
                price: 550,
                category: "Burger",
                rating: 4.7,
                isPopular: true,
            },
            {
                restaurantId: restaurants[2]._id,
                name: "Chicken Royale",
                image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500",
                description: "Crispy chicken fillet with mayo and lettuce.",
                price: 500,
                category: "Burger",
                rating: 4.5,
            },
            {
                restaurantId: restaurants[2]._id,
                name: "French Fries",
                image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
                description: "Golden crispy fries with a pinch of salt.",
                price: 150,
                category: "Sides",
                rating: 4.4,
            }
        );

        // Noodles & Company Foods
        foods.push(
            {
                restaurantId: restaurants[3]._id,
                name: "Chow Mein",
                image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500",
                description: "Stir-fried noodles with vegetables and soy sauce.",
                price: 400,
                category: "Noodles",
                rating: 4.6,
                isPopular: true,
            },
            {
                restaurantId: restaurants[3]._id,
                name: "Pad Thai",
                image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500",
                description: "Thai-style rice noodles with peanuts and lime.",
                price: 450,
                category: "Noodles",
                rating: 4.7,
            },
            {
                restaurantId: restaurants[3]._id,
                name: "Spring Rolls",
                image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500",
                description: "Crispy vegetable rolls with sweet chili sauce.",
                price: 250,
                category: "Appetizer",
                rating: 4.5,
            }
        );

        // Cafe Delight Foods
        foods.push(
            {
                restaurantId: restaurants[4]._id,
                name: "Cappuccino",
                image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500",
                description: "Rich espresso with steamed milk and foam.",
                price: 200,
                category: "Coffee",
                rating: 4.8,
                isPopular: true,
            },
            {
                restaurantId: restaurants[4]._id,
                name: "Chocolate Cake",
                image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
                description: "Moist chocolate cake with chocolate ganache.",
                price: 350,
                category: "Dessert",
                rating: 4.9,
                isPopular: true,
            },
            {
                restaurantId: restaurants[4]._id,
                name: "Club Sandwich",
                image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
                description: "Triple-decker sandwich with chicken and veggies.",
                price: 400,
                category: "Sandwich",
                rating: 4.6,
            }
        );

        await FoodModel.insertMany(foods);

        console.log(" Foods created:", foods.length);
        console.log(" Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error(" Error seeding database:", error);
        process.exit(1);
    }
};

seedData();