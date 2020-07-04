const express = require('express');
require('dotenv/config');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
var validator = require('validator');
const bcrypt = require('bcryptjs');

// function to validate Login form
function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
  
    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
      isFormValid = false;
      errors.email = 'Please provide your email address.';
    }
  
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
      isFormValid = false;
      errors.password = 'Please provide your password.';
    }
  
    if (!isFormValid) {
      message = 'Check the form for errors.';
    }
  
    return {
      success: isFormValid,
      message,
      errors
    };
  }
  
  //function to validate signup form

  function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
  
    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
      isFormValid = false;
      errors.email = 'Please provide a correct email address.';
    }
  
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
      isFormValid = false;
      errors.password = 'Password must have at least 8 characters.';
    }
  
    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Please provide your username.';
    }

    if (!isFormValid) {
      message = 'Check the form for errors.';
    }
  
    return {
      success: isFormValid,
      message,
      errors
    };
  }

//function to generate token

function generateToken(payload){
    
    const data = {
        id : payload._id,
        email :payload.email,
        username :payload.username
    }
     return jwt.sign({
        data
      }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}

//test if user exist

 const isUserExist = async (email,username) => {

    exist = false;

    const isEmailExist = await User.findOne({email : email});

    if(isEmailExist != null)
        exist = true;
    
    const isUsernameExist = await User.findOne({username : username});

    if(isUsernameExist != null)
        exist = true;

    return exist;
}

//Login user

router.post('/signin',async (req,res)=>{

    const validationResult = validateLoginForm(req.body);

    if(!validationResult.success){
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    try{
        const user = await User.findOne({email: req.body.email});

        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if (!user || !isMatch) res.status(400).json({success : false , message : "Credentials Error"});

        const token = generateToken(user);
        res.status(200).json({
            success : true,
            token,
            user
        });
    }
    catch(err){
        res.status(500).send(err);
    }

})


// save user
router.post('/signup',async (req,res)=>{

    const data = req.body;

    const validationResult = validateSignupForm(req.body);

    if(!validationResult.success){
        return res.status(400).json({
            success : false,
            message : validationResult.message,
            errors: validationResult.errors
        })
    }

    const isExist = await isUserExist(req.body.email , req.body.username);

    if(isExist)
        return res.status(400).json({
            success : false,
            message : "User Exist déja",
        })

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const userData = new User({
        username : data.username,
        email    : data.email,
        password : hashedPassword
    });

    try{
        const savedUser = await userData.save();
        const token = generateToken(savedUser);

        return res.status(200).json({token,savedUser});
    }
    catch(err){
        res.status(500).json({message : err});
    }
    
})

module.exports = router;