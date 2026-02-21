const {
  getCurrentUser,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/profile", authMiddleware, getCurrentUser);
router.patch("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
