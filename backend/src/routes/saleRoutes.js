const express = require("express");

const {
    getSales,
    getSaleById,
    createSale,
    updateSale
} = require("../controllers/saleController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales pipeline APIs
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    getSales
);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a sale
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - amount
 *               - assignedRep
 *             properties:
 *               customer:
 *                 type: string
 *                 example: 64abc123456789
 *               amount:
 *                 type: number
 *                 example: 50000
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_PROGRESS
 *                   - WON
 *                   - LOST
 *                 example: PENDING
 *               date:
 *                 type: string
 *                 format: date-time
 *               assignedRep:
 *                 type: string
 *                 example: 64def123456789
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Invalid customer or representative
 */
router.post(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    createSale
);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags:
 *       - Sales
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
 *         description: Sale retrieved successfully
 *       404:
 *         description: Sale not found
 */
router.get(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    getSaleById
);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update sale
 *     tags:
 *       - Sales
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
 *               customer:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_PROGRESS
 *                   - WON
 *                   - LOST
 *               date:
 *                 type: string
 *                 format: date-time
 *               assignedRep:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       404:
 *         description: Sale not found
 */
router.put(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    updateSale
);

module.exports = router;