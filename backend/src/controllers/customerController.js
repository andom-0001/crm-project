const Customer = require("../models/Customer");

// GET /api/customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .populate("assignedRep", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json(customers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get customers",
            error: error.message
        });
    }
};


// GET /api/customers/:id
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate("assignedRep", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json(customer);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get customer",
            error: error.message
        });
    }
};


// POST /api/customers
const createCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            address,
            assignedRep,
            notes
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const customer = await Customer.create({
            name,
            email,
            phone,
            company,
            address,
            assignedRep,
            notes
        });

        const populatedCustomer = await customer.populate(
            "assignedRep",
            "fullName email role"
        );

        res.status(201).json(populatedCustomer);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create customer",
            error: error.message
        });
    }
};


// PUT /api/customers/:id
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedRep", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json(customer);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update customer",
            error: error.message
        });
    }
};


// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(
            req.params.id
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete customer",
            error: error.message
        });
    }
};


module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};