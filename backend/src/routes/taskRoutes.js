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

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    getTasks
);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Follow up with customer
 *               description:
 *                 type: string
 *                 example: Call customer about proposal
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-20T10:00:00.000Z
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                 example: HIGH
 *               assignedTo:
 *                 type: string
 *                 example: 64abc123456789
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *                 example: PENDING
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Required data is missing
 */
router.post(
    "/",
    protect,
    authorize("ADMIN", "SALES"),
    createTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags:
 *       - Tasks
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
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    getTaskById
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags:
 *       - Tasks
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *               assignedTo:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put(
    "/:id",
    protect,
    authorize("ADMIN", "SALES"),
    updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags:
 *       - Tasks
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
 *         description: Task deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.delete(
    "/:id",
    protect,
    authorize("ADMIN"),
    deleteTask
);

module.exports = router;