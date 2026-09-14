const express = require("express");

const {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
} = require("../controllers/leadController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLeads);

router.get("/:id", protect, getLeadById);

router.post("/", protect, createLead);

router.put("/:id", protect, updateLead);

router.delete("/:id", protect, deleteLead);

module.exports = router;