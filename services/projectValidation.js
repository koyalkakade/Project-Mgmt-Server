function validateProject(data) {

    const {
        title,
        description,
        startDate,
        endDate,
        department,
    } = data;

    // Title
    if (!title || title.trim().length < 3) {
        return {
            success: false,
            msg: "Project title must be at least 3 characters."
        };
    }

    // Description
    if (!description || description.trim().length < 10) {
        return {
            success: false,
            msg: "Project description must be at least 10 characters."
        };
    }

    // Start Date
    if (!startDate) {
        return {
            success: false,
            msg: "Start Date is required."
        };
    }

    // End Date
    if (!endDate) {
        return {
            success: false,
            msg: "End Date is required."
        };
    }

    // Date Validation
    if (new Date(endDate) < new Date(startDate)) {
        return {
            success: false,
            msg: "End Date cannot be earlier than Start Date."
        };
    }

    // Department Validation
    const departments = [
        "HR",
        "Information Technology",
        "Development",
        "Finance",
        "Cloud"
    ];

    if (!department || !departments.includes(department)) {
        return {
            success: false,
            msg: "Invalid Department."
        };
    }

    return {
        success: true
    };
}

module.exports = {validateProject};