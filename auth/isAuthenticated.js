var express = require('express');
var app = express()
require('dotenv/config');
const jwt = require('jsonwebtoken');

function isAutenticated (req, res ,next){
    const authHeader = req.headers['authorisation'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.status(401).json({success : false , message : 'No Token Send'});

    jwt.verify(token,process.env.TOKEN_SECRET,(err , user)=>{
        if(err) return res.status(403).json(err); 

        req.user = user;
        next();
    });
}

module.exports = isAutenticated;