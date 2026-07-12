const mongoose = require("mongoose");

const roleRequestSchema = new mongoose.Schema(
    {
        user_ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        requestedRole: {
            type: String,
            enum: ["HOD"],
            default: "HOD"
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null
        },

        remark: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const RoleRequest = mongoose.model("RoleRequest", roleRequestSchema);

module.exports = RoleRequest;