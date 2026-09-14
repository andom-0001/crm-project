const express = require("express");

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ADMIN + SALES
router.get("/", protect, authorize("ADMIN", "SALES"), getTasks);

router.get("/:id", protect, authorize("ADMIN", "SALES"), getTaskById);

router.post("/", protect, authorize("ADMIN", "SALES"), createTask);

router.put("/:id", protect, authorize("ADMIN", "SALES"), updateTask);

// ADMIN ONLY
router.delete("/:id", protect, authorize("ADMIN"), deleteTask);

module.exports = router;