const express = require("express");

const {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
} = require("../controllers/leadController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management APIs
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Get all leads
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    getLeads
);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a lead
 *     tags:
 *       - Leads
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
 *               - contactInfo
 *               - source
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit Kumar
 *               contactInfo:
 *                 type: string
 *                 example: amit@gmail.com
 *               source:
 *                 type: string
 *                 enum:
 *                   - Referral
 *                   - Ads
 *                   - Web
 *                 example: Web
 *               status:
 *                 type: string
 *                 enum:
 *                   - NEW
 *                   - CONTACTED
 *                   - QUALIFIED
 *                   - CONVERTED
 *                   - LOST
 *                 example: NEW
 *     responses:
 *       201:
 *         description: Lead created successfully
 *       400:
 *         description: Required data is missing
 */
router.post(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    createLead
);

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     summary: Get lead by ID
 *     tags:
 *       - Leads
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
 *         description: Lead retrieved successfully
 *       404:
 *         description: Lead not found
 */
router.get(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    getLeadById
);

/**
 * @swagger
 * /api/leads/{id}:
 *   put:
 *     summary: Update lead
 *     tags:
 *       - Leads
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
 *               contactInfo:
 *                 type: string
 *               source:
 *                 type: string
 *                 enum:
 *                   - Referral
 *                   - Ads
 *                   - Web
 *               status:
 *                 type: string
 *                 enum:
 *                   - NEW
 *                   - CONTACTED
 *                   - QUALIFIED
 *                   - CONVERTED
 *                   - LOST
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       404:
 *         description: Lead not found
 */
router.put(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    updateLead
);

/**
 * @swagger
 * /api/leads/{id}:
 *   delete:
 *     summary: Delete lead
 *     tags:
 *       - Leads
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
 *         description: Lead deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Lead not found
 */
router.delete(
    "/:id",
    protect,
    authorize("ADMIN"),
    deleteLead
);

module.exports = router;