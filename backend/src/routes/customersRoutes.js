const express = require("express");

const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management APIs
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    getCustomers
);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a customer
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               company:
 *                 type: string
 *                 example: ABC Technologies
 *               address:
 *                 type: string
 *                 example: Delhi
 *               notes:
 *                 type: string
 *                 example: New customer
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Customer name is required
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    createCustomer
);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64abc123456789
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    getCustomerById
);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               address:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    updateCustomer
);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Customer not found
 */
router.delete(
    "/:id",
    protect,
    authorize("ADMIN"),
    deleteCustomer
);

module.exports = router;