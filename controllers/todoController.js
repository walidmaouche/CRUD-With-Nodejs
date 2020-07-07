const express = require('express');
const todo = require('../models/Todo');
const mongoose = require('mongoose');


function validateAddTaskForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
  
    if (!payload || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Please provide title task.';
    }

    if (!payload || typeof payload.description !== 'string' || payload.description.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide description task.';
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

//get all tasks
async function index(user){

    try{
        const tasks = await todo.find({created_by : user});

        if (!tasks) return {success : false,status :400,message:'No Task Found'};        

        return {success : true,status :200,message:'Tasks fetched',tasks};  
    }
    catch(err){
        return {success : false,status :500,message:err};  
    }
}

async function store(data,userID){
    
    const validationResult = validateAddTaskForm(data);

    if(!validationResult.success)
        return {success : false,status :400,message : validationResult.message,errors: validationResult.errors};

    const todoData = new todo({
        title         : data.title,
        description   : data.description,
        priority      : data.priority,
        created_by    : userID,
        associated_to : data.associated_to
    });

    try{
        const savedTask = await todoData.save();
        return {success : true,status :200,message:'Task saved',task:savedTask};
    }
    catch(err){
        res.status(500).json({message : err});
    }
}
// show one task
async function show(taskID,userID){
    try{
        if (!mongoose.Types.ObjectId.isValid(taskID))
            return {success: false,status:404,message:'No Task Found'};

        const id = new mongoose.Types.ObjectId(taskID);
        const task = await todo.findById({_id : id});
        if (!task) 
            return {success: false,status:404,message:'No Task Found'};

        if(task.created_by != userID && task.associated_to != userID)   
            return {success: false,status:403,message:'Forbiden'};

        return {success: true,status:200,message:'task fetched',task};

    }catch(err){
        return {success: false,status:500,message:err};
    }

}

function edit(){

}

function update(){

}

function destroy(){

}

module.exports = {
    index,
    show,
    store
}