const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:'Pending',
        enum:["Pending","In-progress","Completed"]
    },
    department:{
        type:String,
        enum:["HR","Information Technology","Development","Finance","Cloud"]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{
    timestamps:true
})


const Project = mongoose.model("project",projectSchema)

module.exports = Project