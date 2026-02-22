const {
    getAllUsers,
    getSingleUser,
    getPlatformStats,
    deleteUser,
    getAdminProfile,
    updateAdminProfile,
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorize");

const express = require("express");
const router = express.Router();

// All admin routes require authentication + admin privileges
router.use(authMiddleware);
router.use(authorizeAdmin);

router.get("/profile", getAdminProfile);
router.patch("/profile", updateAdminProfile);

router.get("/users", getAllUsers);
router.get("/users/:id", getSingleUser);
router.get("/stats", getPlatformStats);
router.delete("/users/:id", deleteUser);

module.exports = router;
