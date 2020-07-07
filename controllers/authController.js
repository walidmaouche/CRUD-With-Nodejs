require('dotenv/config');
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

async function isUserExist(email,username) {

    exist = false;
    const isEmailExist = await User.findOne({email : email});

    if(isEmailExist != null)
        exist = true;
    
    const isUsernameExist = await User.findOne({username : username});

    if(isUsernameExist != null)
        exist = true;

    return exist;
}

// Save new user
async function saveNewUser(user){

    const savedUser = await user.save();
    const token = generateToken(savedUser);
    return {success : true,status :200,message:'User created successfully',token,'user' : savedUser};        
}

// function sign Up
async function signUp(data){
    const validationResult = validateSignupForm(data);

    if(!validationResult.success)
        return {success : false,status :400,message : validationResult.message,errors: validationResult.errors};
    
    try{
        const isExist = await isUserExist(data.email , data.username);
        if(isExist) return {success : false,status :400,message : "User already Exist"};
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userData = new User({username : data.username,email : data.email,password : hashedPassword});
        const savedUser = await saveNewUser(userData);

        return savedUser;       
    }
    catch(err){
        return {success: false,status:500,message : err};
    }
}

async function signIn(payload){

    const email    = payload.email;
    const password = payload.password;
    const validationResult = validateLoginForm(payload);

    if(!validationResult.success)
        return {success: false,status:400,message: validationResult.message,errors: validationResult.errors};

    try{
        const user = await User.findOne({email: email});
        const isMatch = await bcrypt.compare(password,user.password);

        if (!user || !isMatch) return {success : false ,status:400, message : "Credentials Error"};

        const token = generateToken(user);
        return {success : true,status:200,token,user};
    }
    catch(err){
        return {success:false, status:500 ,message:err};
    }
}

module.exports.signUp = signUp;
module.exports.signIn = signIn;