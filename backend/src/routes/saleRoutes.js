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

// ADMIN + SALES
router.get("/", protect, authorize("ADMIN", "SALES"), getSales);

router.get("/:id", protect, authorize("ADMIN", "SALES"), getSaleById);

router.post("/", protect, authorize("ADMIN", "SALES"), createSale);

router.put("/:id", protect, authorize("ADMIN", "SALES"), updateSale);

module.exports = router;