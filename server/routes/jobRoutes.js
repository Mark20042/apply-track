const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllJobs);
router.post("/", createJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);
router.get("/stats", showStats);

module.exports = router;
