const express = require('express');

const router = express.Router();

//const todo = require('../models/Todo');
const todo = require('../controllers/todoController');

//show all tasks
router.get('/todos',async (req,res)=>{
    const result = await todo.index(req.user.id);
    return res.status(result.status).json(result);
})

// show selected task
router.get('/todos/:taskId',async (req,res)=>{
    const result = await todo.show(req.params.taskId,req.user.id);
    return res.status(result.status).json(result);
})

// add new task
router.post('/todos',async (req,res)=>{
    console.log('add route');
    console.log(req.body);

    const result = await todo.store(req.body,req.user.id);
    return res.status(result.status).json(result);
})

//update task
router.patch('/todos/:taskId',async (req,res)=>{
    
    try{
        todo.updateOne({_id : req.params.taskId},{$set:req.body},function(err,result){
            if(err) res.status(500).json(err);
            console.log(result);
            res.status(200).json(result); 
        });

       
    }
    catch(err){
        res.status(500).json(err);
    }
})

//delete task
router.delete('/todos/:taskId',async (req,res)=>{

    try{
        const task = await todo.findByIdAndDelete(req.params.taskId);
        if (!task) res.status(404).send("No Task Found");
        res.status(200).send({id:req.params.taskId, message:"Task deleted Successfully"});
    }
    catch(err){
        res.status(500).json({message : err})
    }
})

module.exports = router;