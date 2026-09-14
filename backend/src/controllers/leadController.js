const Lead = require("../models/Lead");


// GET /api/leads
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate("assignedRep", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json(leads);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get leads",
            error: error.message
        });
    }
};


// GET /api/leads/:id
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate("assignedRep", "fullName email role");

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json(lead);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get lead",
            error: error.message
        });
    }
};


// POST /api/leads
const createLead = async (req, res) => {
    try {
        const {
            name,
            contactInfo,
            source,
            status,
            assignedRep
        } = req.body;

        if (!name || !contactInfo || !source) {
            return res.status(400).json({
                message: "Name, contact info and source are required"
            });
        }

        const lead = await Lead.create({
            name,
            contactInfo,
            source,
            status,
            assignedRep
        });

        const populatedLead = await lead.populate(
            "assignedRep",
            "fullName email role"
        );

        res.status(201).json(populatedLead);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create lead",
            error: error.message
        });
    }
};


// PUT /api/leads/:id
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedRep", "fullName email role");

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json(lead);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update lead",
            error: error.message
        });
    }
};


// DELETE /api/leads/:id
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json({
            message: "Lead deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete lead",
            error: error.message
        });
    }
};


module.exports = {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
};