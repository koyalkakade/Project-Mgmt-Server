const RoleRequest = require("../models/roleRequestModel");
const User = require("../models/userModel");

async function applyForHOD(req, res) {
    try {
        const user_id = req.user.id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).send({
                success: false,
                msg: "User not found"
            });
        }

        if (user.role === "HOD") {
            return res.status(400).send({
                success: false,
                msg: "You are already HOD"
            });
        }

        const existingRequest = await RoleRequest.findOne({
            user_id,
            status: "Pending"
        });

        if (existingRequest) {
            return res.status(400).send({
                success: false,
                msg: "Your HOD request is already pending"
            });
        }

        const request = await RoleRequest.create({
            user_ID,
            requestedRole: "HOD"
        });

        res.status(201).send({
            success: true,
            msg: "HOD request submitted successfully",
            request
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}


async function getAllRoleRequests(req, res) {
    try {
        const requests = await RoleRequest.find()
            .populate("user_id", "name email contactNumber role")
            .populate("reviewedBy", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            totalRequests: requests.length,
            requests
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

async function approveHODRequest(req, res) {
    try {
        const ID = req.params.ID;

        const request = await RoleRequest.findById(ID);

        if (!request) {
            return res.status(404).send({
                success: false,
                msg: "Request not found"
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).send({
                success: false,
                msg: "Request already processed"
            });
        }

        await User.findByIdAndUpdate(
            request.user_id,
            { role: "HOD" },
            { new: true }
        );

        request.status = "Approved";
        request.reviewedBy = req.user.id;
        await request.save();

        res.status(200).send({
            success: true,
            msg: "User role changed to HOD successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

async function rejectHODRequest(req, res) {
    try {
        const ID = req.params.ID;
        const { remark } = req.body;

        const request = await RoleRequest.findById(ID);

        if (!request) {
            return res.status(404).send({
                success: false,
                msg: "Request not found"
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).send({
                success: false,
                msg: "Request already processed"
            });
        }

        request.status = "Rejected";
        request.reviewedBy = req.user.id;
        request.remark = remark || "Request rejected by admin";
        await request.save();

        res.status(200).send({
            success: true,
            msg: "HOD request rejected successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

module.exports={
    applyForHOD,getAllRoleRequests,approveHODRequest,rejectHODRequest
}