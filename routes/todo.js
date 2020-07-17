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
    const result = await todo.store(req.body,req.user.id);
    return res.status(result.status).json(result);
})

//update task
router.patch('/todos/:taskId',async (req,res)=>{
    const result = await todo.update(req.user.id,req.params.taskId,req.body);
    return res.status(result.status).json(result);
})

//delete task
router.delete('/todos/:taskId',async (req,res)=>{

    const result = await todo.destroy(req.user.id,req.params.taskId);
    return res.status(result.status).json(result);

})

module.exports = router;