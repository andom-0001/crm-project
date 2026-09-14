const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const User = require("../models/User");


// GET /api/sales
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("customer", "name email phone company")
            .populate("assignedRep", "fullName email role")
            .sort({ date: -1 });

        res.status(200).json(sales);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get sales",
            error: error.message
        });
    }
};


// GET /api/sales/:id
const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate("customer", "name email phone company")
            .populate("assignedRep", "fullName email role");

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        res.status(200).json(sale);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get sale",
            error: error.message
        });
    }
};


// POST /api/sales
const createSale = async (req, res) => {
    try {
        const {
            customer,
            amount,
            status,
            date,
            assignedRep
        } = req.body;

        if (!customer || amount === undefined || !assignedRep) {
            return res.status(400).json({
                message: "Customer, amount and assigned rep are required"
            });
        }

        // Check customer
        const customerExists = await Customer.findById(customer);

        if (!customerExists) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Check sales rep
        const userExists = await User.findById(assignedRep);

        if (!userExists) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        const sale = await Sale.create({
            customer,
            amount,
            status,
            date,
            assignedRep
        });

        const populatedSale = await sale.populate([
            {
                path: "customer",
                select: "name email phone company"
            },
            {
                path: "assignedRep",
                select: "fullName email role"
            }
        ]);

        res.status(201).json(populatedSale);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create sale",
            error: error.message
        });
    }
};


// PUT /api/sales/:id
const updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        .populate("customer", "name email phone company")
        .populate("assignedRep", "fullName email role");

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        res.status(200).json(sale);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update sale",
            error: error.message
        });
    }
};


module.exports = {
    getSales,
    getSaleById,
    createSale,
    updateSale
};