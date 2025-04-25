const express = require('express');
const router = express.Router();
const database = require('../db/database');
const { requireAuth, requireAdmin, loginUser } = require('../middleware/auth');
const { validateSchema, userSchema } = require('../middleware/validation');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const result = await loginUser(email, password);
  
  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json(result);
});

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await database.findAll('users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const user = await database.findById('users', req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', validateSchema(userSchema), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const existingUsers = await database.findAll('users', { email });
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const id = Date.now().toString();
    const user = new User(id, name, email, role);
    
    await database.insert('users', user.toJSON());
    
    res.status(201).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/:id', requireAuth, validateSchema(userSchema), async (req, res) => {
  try {
    const user = await database.findById('users', req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { name, email, role } = req.body;
    
    if (email !== user.email) {
      const existingUsers = await database.findAll('users', { email });
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    const updatedUser = await database.update('users', req.params.id, {
      name,
      email,
      role: req.user.role === 'admin' ? role : user.role
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await database.findById('users', req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await database.delete('users', req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
