const express=require('express');
const router=express.Router();
const User=require('../models/User');

router.post("/add",async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const newUser=new User({name,email,password});
        await newUser.save();
        res.status(201).json({message:"User successfully created",user:newUser});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
});

module.exports=router;