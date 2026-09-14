const express = require("express");

const {
    getSales,
    getSaleById,
    createSale,
    updateSale
} = require("../controllers/saleController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSales);

router.post("/", protect, createSale);

router.get("/:id", protect, getSaleById);

router.put("/:id", protect, updateSale);

module.exports = router;