const express = require('express');
const router = express.Router();
const database = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { validateSchema, taskSchema } = require('../middleware/validation');
const Task = require('../models/Task');

router.get('/', requireAuth, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      tasks = await database.findAll('tasks');
    } else {
      tasks = await database.findAll('tasks', { assigneeId: req.user.id });
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const task = await database.findById('tasks', req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.assigneeId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.post('/', requireAuth, validateSchema(taskSchema), async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const assigneeId = req.body.assigneeId || req.user.id;
    
    if (req.body.assigneeId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can assign tasks to others' });
    }
    
    const id = Date.now().toString();
    const task = new Task(id, title, description, dueDate, assigneeId);
    
    await database.insert('tasks', task.toJSON());
    
    res.status(201).json(task.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', requireAuth, validateSchema(taskSchema), async (req, res) => {
  try {
    const task = await database.findById('tasks', req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.assigneeId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { title, description, dueDate, assigneeId } = req.body;
    
    const updates = { title, description, dueDate };
    
    if (assigneeId && req.user.role === 'admin') {
      updates.assigneeId = assigneeId;
    }
    
    const updatedTask = await database.update('tasks', req.params.id, updates);
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.patch('/:id/complete', requireAuth, async (req, res) => {
  try {
    const task = await database.findById('tasks', req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.assigneeId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedTask = await database.update('tasks', req.params.id, {
      completed: true,
      updatedAt: new Date().toISOString()
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const task = await database.findById('tasks', req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.assigneeId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await database.delete('tasks', req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
