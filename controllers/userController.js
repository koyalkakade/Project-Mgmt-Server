const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const validateUser = require('../services/userValidation')
const jwt = require('jsonwebtoken')

async function register(req,res) {
    try { 

         if (!req.file) {
            return res.status(400).send({success: false,msg: "Please upload image",});
        }
        const validation = await validateUser(req.body)
            if (!validation.success) {
            return res.status(400).send(validation);
        }
    let{name,email,password, contactNumber} = req.body

        const existingUser = await User.findOne({email:email})
        if(existingUser){
            return res.status(400).send({success:false, msg:"User already exists..."})
        }

        password = await bcrypt.hash(password,8)
        let imgPath = `/uploads/users/${req.file.filename}`;


        const newUser = await User.create({name, email, password, contactNumber,imgPath})
       // console.log(newUser)
        await newUser.save()

        res.status(200).send({success:true, msg:"Successfully Registered..."})

    }catch (error) {
        console.log(error.message)
        res.status(500).send({msg:"Server Error"})
    }
}

// let existingUser
const login = async (req,res)=>{
    const {email, password} = req.body

    try {
         const existingUser =await User.findOne({email:email})
           // console.log(existingUser)
        if(!existingUser){
            return res.status(401).send({msg:"User does not exist",success:false})
        }

        const isPassCorrect = await bcrypt.compare(password,existingUser.password)
       // console.log(isPassCorrect)
        if(!isPassCorrect){
            return res.status(401).send({msg:"Invalid credentials",success:false})
        }

        if(existingUser.status === "inactive"){
            return res.status(400).send({success:false, msg:"You are IN-ACTIVE"})
        }


        // const id = existingUser._id 
        // const role = existingUser.role
        const token = jwt.sign({id: existingUser._id,
                role: existingUser.role}, process.env.SECRET_KEY, {expiresIn:"2h"})
       // console.log(token)
        res.status(200).send({msg:"Logged in succesfully",success:true, token:token})

} catch (error) {
        res.status(500).send({msg:"Server error", success:false})
    }
}

const getUserInfo = async(req,res) =>{
    try{
        //console.log("************", req.user)


        const loggedUser = await User.findById(req.user.id,{password:0,createdAt:0,updatedAt:0})


    // Convert Sequelize instance to plain object
        const userData = loggedUser.toObject();

        // Update image path
        if (userData.imgPath) {
            userData.imgPath = `http://localhost:7005${userData.imgPath}`;
        }

       // console.log(userData);
        res.status(200).send({loggedUser:userData,success:true})

        } catch (error) {
        res.status(500).send({msg:"Server error", success:false})
    }
}

module.exports = {
    register, login , getUserInfo
}