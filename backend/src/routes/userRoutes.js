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
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: CRM User
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid data
 */
router.post("/register", registerUser);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: crm123@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
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