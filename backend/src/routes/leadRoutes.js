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

// ADMIN + SALES
router.get("/", protect, authorize("ADMIN", "SALES"), getLeads);

router.get("/:id", protect, authorize("ADMIN", "SALES"), getLeadById);

router.post("/", protect, authorize("ADMIN", "SALES"), createLead);

router.put("/:id", protect, authorize("ADMIN", "SALES"), updateLead);

// ADMIN ONLY
router.delete("/:id", protect, authorize("ADMIN"), deleteLead);

module.exports = router;