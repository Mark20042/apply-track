const {
  getCurrentUser,
  getCurrentUserOrNull,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const express = require("express");
const router = express.Router();

// Optional auth: returns 200 with { user } or { user: null }. Use for initial app load to avoid 401.
router.get("/me", optionalAuth, getCurrentUserOrNull);
router.get("/profile", authMiddleware, getCurrentUser);
router.patch("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
