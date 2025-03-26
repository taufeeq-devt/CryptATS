const express = require("express");
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcrypt= require('bcryptjs');
const route = express.Router();
const jwt= require('jsonwebtoken');
const fetchuser= require('../middleware/fetchuser');
let success=false;

route.post('/',fetchuser,[
  body("email","Enter Your Correct Email").isEmail(),
  body("password","Invalid Password").exists()
],async(req,res)=>{
  const JWT_secret_string='shhhhh';
  let error=validationResult(req);
  if(!error.isEmpty){
    res.status(400).json({error:error.array()});
  }
  try{
  let user=await User.findOne({email:req.body.email});
  if(!user){
    return res.status(400).json({error:"Enter Valid Your Email and Password!"});
  }
   const pass= await bcrypt.compare(req.body.password,user.password);
   if(!pass){
    res.status(400).json({error:"Enter Your Valid Email and Password!"})
   }
   const data={
    user:{
      id:user.id
    }
   }
   const name={
    user:{
      name:user.name
    }
  }
   const token=jwt.sign(data,JWT_secret_string);
   success=true;
    res.json({success,token,name});
  }catch(err){
    console.error(err);
    res.status(500).send({error:"Some Error Occured"});
  }
  })

module.exports = route;