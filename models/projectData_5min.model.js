const mongoose = require("mongoose");

const projectData_5minSchema = mongoose.Schema({
    "timestamp": Date,
    "project_id": Number,
    "swiftPV_project_id": Number,
    parameters:{
        "power": Number,
        "energy": Number,
        "pv_index": Number,
        "expected_power": Number,
        "revenue_rate": Number,
        "expected_energy": Number,
        "poa_irradiance": Number,
        "performance_ratio": Number
    }
}, {
    strict: false,
    collection: "ProjectData"
})

const projectData_5minModel = mongoose.model('ProjectData', projectData_5minSchema);

module.exports = {
    projectData_5minSchema, 
    projectData_5minModel
}