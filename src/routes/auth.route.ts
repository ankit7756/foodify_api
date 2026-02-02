// import { Router } from "express";
// import { register, login, getProfile, updateProfile } from "../controllers/auth.controller";
// import { authMiddleware } from "../middleware/auth.middleware";
// import { uploadProfileImage } from "../middleware/upload.middleware";

// const router = Router();

// // Public routes (no auth needed)
// router.post("/register", register);
// router.post("/login", login);

// // Protected routes (auth required)
// router.get("/profile", authMiddleware, getProfile);
// router.put("/profile", authMiddleware, uploadProfileImage, updateProfile);

// export default router;

import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadProfileImage } from "../middleware/upload.middleware";

const router = Router();

// Public routes (no auth needed)
router.post("/register", register);
router.post("/login", login);

// Protected routes (auth required)
router.get("/profile", authMiddleware, getProfile);

// 🔄 CHANGE THIS: from /profile to /:id
router.put("/:id", authMiddleware, uploadProfileImage, updateProfile);

export default router;