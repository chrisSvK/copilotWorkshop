const express = require('express');
const router = express.Router();
const database = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const Comment = require('../models/Comment');

// Get all comments
router.get('/', requireAuth, async (req, res) => {
  try {
    const comments = await database.findAll('comments');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get comments by task ID
router.get('/task/:taskId', requireAuth, async (req, res) => {
  try {
    const comments = await database.findAll('comments', { taskId: req.params.taskId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments for this task' });
  }
});

// Get a specific comment by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await database.findById('comments', req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
});

// Create a new comment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, taskId } = req.body;
    
    if (!content || !taskId) {
      return res.status(400).json({ error: 'Content and taskId are required' });
    }
    
    // Check if the task exists
    const task = await database.findById('tasks', taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const id = Date.now().toString();
    const comment = new Comment(id, content, taskId, req.user.id);
    
    await database.insert('comments', comment.toJSON());
    
    res.status(201).json(comment.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update a comment
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await database.findById('comments', req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Only the comment author can update it
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Create a Comment instance to use the update method
    const commentObj = new Comment(comment.id, comment.content, comment.taskId, comment.userId);
    commentObj.createdAt = comment.createdAt;
    commentObj.updateContent(content);
    
    const updatedComment = await database.update('comments', req.params.id, commentObj.toJSON());
    
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await database.findById('comments', req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Only the comment author or an admin can delete it
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await database.delete('comments', req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
