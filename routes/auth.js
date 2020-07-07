const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

//Login user
router.post('/signin',async (req,res)=>{
  const result = await auth.signIn(req.body);
  return res.status(result.status).json(result);
})

// save user
router.post('/signup',async (req,res)=>{
  const result = await auth.signUp(req.body);
  return res.status(result.status).json(result);
})

module.exports = router;