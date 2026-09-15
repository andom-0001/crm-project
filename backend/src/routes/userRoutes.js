const express = require("express");

const {
    registerUser,
    loginUser,
    getMe,
    adminTest,
    salesTest
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Logged-in users
router.get("/users/me", protect, getMe);

// ADMIN only
router.get(
    "/admin-test",
    protect,
    authorize("ADMIN"),
    adminTest
);

// ADMIN + SALES
router.get(
    "/sales-test",
    protect,
    authorize("ADMIN", "SALES"),
    salesTest
);
router.get(
    "/users",
    protect,
    authorize("ADMIN", "SALES"),
    getUsers
);

module.exports = router;