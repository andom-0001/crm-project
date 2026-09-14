const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "IN_PROGRESS",
                "WON",
                "LOST"
            ],
            default: "PENDING"
        },

        date: {
            type: Date,
            default: Date.now
        },

        assignedRep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Sale", saleSchema);