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

// ADMIN + SALES
router.get("/", protect, authorize("ADMIN", "SALES"), getCustomers);

router.get("/:id", protect, authorize("ADMIN", "SALES"), getCustomerById);

router.post("/", protect, authorize("ADMIN", "SALES"), createCustomer);

router.put("/:id", protect, authorize("ADMIN", "SALES"), updateCustomer);

// ADMIN ONLY
router.delete("/:id", protect, authorize("ADMIN"), deleteCustomer);

module.exports = router;