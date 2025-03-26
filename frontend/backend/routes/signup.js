const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt= require('bcryptjs');
const route = express.Router();
const jwt= require('jsonwebtoken');
let success=false;

route.post(
  `/`,
  [
    body("name", "Please Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Please Enter a Valid Email").isEmail(),
    body("password",
    "Please Enter a Valid Password with Minimum 5 charracters").isLength({
      min: 5
    }),
  ],
async (req, res) => {
  try{
    const salt= await bcrypt.genSalt(10);
    const JWT_secret_string='shhhhh';
    let error = validationResult(req);
    if (!error.isEmpty) {
      return res.status(400).json({ error: errors.array() });
    }
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email Already Exists" });
      }
      const pass=await bcrypt.hash(req.body.password,salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: pass,
      });
      user.save();
      const data={
        user:{
          id: user.id
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
      res.send("Some Error Occured");
    }
  }
);
module.exports=route;