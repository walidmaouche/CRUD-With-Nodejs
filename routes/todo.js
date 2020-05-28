const express = require('express');

const router = express.Router();

const todo = require('../models/Todo');

//show all tasks
router.get('/',async (req,res)=>{

    try{
        const tasks = await todo.find();
        if (!tasks) res.status(400).send("No Task Found");
        res.status(200).send(tasks);
    }
    catch(err){
        res.status(500).send(err);
    }

})

// show selected task
router.get('/:taskId',async (req,res)=>{

    try{
        const task = await todo.findById({_id : req.params.taskId});

        if (!task) res.status(404).send("No Task Found");
        
        res.status(200).send(task);

    }catch(err){
        res.status(500).send(err)
    }
})

// add new task
router.post('/add',async (req,res)=>{
    console.log('add route');
    console.log(req.body);

    const data = req.body;
    const todoData = new todo({
        title         : data.title,
        description   : data.description,
        priority      : data.priority,
        created_by    : data.created_by,
        associated_to : data.associated_to
    });

    try{
        const savedTask = await todoData.save();
        res.status(200).json(savedTask);
    }
    catch(err){
        res.status(500).json({message : err});
    }
    

})

//update task
router.patch('/:taskId',async (req,res)=>{
    
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
router.delete('/:taskId',async (req,res)=>{

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