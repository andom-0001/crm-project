const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        contactInfo: {
            type: String,
            required: true,
            trim: true
        },

        source: {
            type: String,
            enum: ["Referral", "Ads", "Web"],
            required: true
        },

        status: {
            type: String,
            enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"],
            default: "NEW"
        },

        assignedRep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Lead", leadSchema);