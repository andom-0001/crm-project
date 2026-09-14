const Task = require("../models/Task");


// GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "fullName email role")
            .sort({ dueDate: 1 });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get tasks",
            error: error.message
        });
    }
};


// GET /api/tasks/:id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "fullName email role");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get task",
            error: error.message
        });
    }
};


// POST /api/tasks
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            status
        } = req.body;

        if (!title || !dueDate || !assignedTo) {
            return res.status(400).json({
                message: "Title, due date and assigned user are required"
            });
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            status
        });

        const populatedTask = await task.populate(
            "assignedTo",
            "fullName email role"
        );

        res.status(201).json(populatedTask);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
};


// PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedTo", "fullName email role");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
};


// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};