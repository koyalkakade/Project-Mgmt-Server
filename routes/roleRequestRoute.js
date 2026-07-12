const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    applyForHOD,
    getAllRoleRequests,
    approveHODRequest,
    rejectHODRequest
} = require("../controllers/roleRequestController");

router.post("/applyHOD", auth, applyForHOD);

router.get("/getAllRequests", auth, admin, getAllRoleRequests);

router.patch("/approve/:ID", auth, admin, approveHODRequest);

router.patch("/reject/:ID", auth, admin, rejectHODRequest);

module.exports = router;