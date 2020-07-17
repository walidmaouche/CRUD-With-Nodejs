const express = require('express');
const todo = require('../models/Todo');
const mongoose = require('mongoose');


function validateTaskForm(payload) {
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

async function isUserExist(userID){
    try{
        const user = await user.findById({_id : userID});
        console.log(user);
        if(!user)
            return false;
        return true
    }
    catch(err){
        return false;
    } 
}

async function isAuthorised(taskID,userID){
    try{
        const task = await todo.findById({_id : taskID});

        if(task.created_by != userID && task.associated_to != userID)   
            return false;
    
        return true;
    }
    catch(err){
        return false
    }
    
}

async function isExist(taskID){
    try{
        const task = await todo.findById({_id : taskID});
        if(task == null)   
            return false;
    
        return true;
    }
    catch(err){
        return false;
    }
    
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



// show one task
async function show(taskID,userID){
    try{
        if (!mongoose.Types.ObjectId.isValid(taskID))
            return {success: false,status:404,message:'No Task Found'};

        const task = await todo.findById({_id : taskID});
        if (!task) 
            return {success: false,status:404,message:'No Task Found'};

        const authorised = await isAuthorised(taskID,userID)
        if(!authorised)
            return {success: false,status:403,message:'Forbiden'};

        return {success: true,status:200,message:'task fetched',task};

    }catch(err){
        return {success: false,status:500,message:err};
    }

}

async function store(data,userID){
    
    const validationResult = validateTaskForm(data);

    if(!validationResult.success)
        return {success : false,status :400,message : validationResult.message,errors: validationResult.errors};

    if(!mongoose.Types.ObjectId.isValid(data.associated_to) || !isUserExist(data.associated_to))
        return {success:false,status:400,message:"User associated_to does not exist"};

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
        return {success:false,status:200,message:err};
    }
}

async function update(userID,taskID,newData){

    const validationResult = validateTaskForm(newData);
    if(!validationResult.success)
        return {success : false,status:400,message : validationResult.message,errors: validationResult.errors};

    try{
        if (!mongoose.Types.ObjectId.isValid(taskID))
            return {success: false,status:404,message:'No Task Found'};

        const exist = await isExist(taskID)
        if(!exist)
        return {success: false,status:404,message:'No Task Found'};

        const authorised = await isAuthorised(taskID,userID)
        if(!authorised)
            return {success: false,status:403,message:'Forbiden'};

        const task = await todo.updateOne({_id : taskID},{$set:newData});

        return {success: true,status:200,message:'task updated',task};
    }
    catch(err){
      return {success:false,status:500,message:err};
    }
}

async function destroy(userID,taskID){

    try{
        const exist = await isExist(taskID);
        if(!exist)
        return {success: false,status:404,message:'No Task Found'};

        const authorised = await isAuthorised(taskID,userID)
        if(!authorised)
            return {success: false,status:403,message:'Forbiden'};

        const task = await todo.findOneAndRemove(taskID);

        return {success: true,status:200,task,message:'Task deleted Successfully'};
    }
    catch(err){
        return {success: false,status:500,message:err};
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}