const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const parsedId = parseInt(userId);
  const userData = findUserById(parsedId);
  
  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(userData);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask = createTask(title, description, dueDate);
  res.status(201).json(newTask);
});

function exampleServerFunction() {
  console.log('This is an example function for search demonstration.');
}

function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function handleDatabaseError(error, operation) {
  console.error(`Database error during ${operation}:`, error.message);
  return {
    success: false,
    error: `Failed to complete ${operation}`,
    details: error.message
  };
}

function findUserById(id) {
  const users = {
    '1': { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
    '2': { id: '2', name: 'Bob Johnson', email: 'bob@example.com' }
  };
  return users[id];
}

function createTask(title, description, dueDate) {
  const parsedDate = new Date(dueDate + "T00:00:00");
  
  return {
    id: Math.floor(Math.random() * 10000),
    title,
    description,
    dueDate: parsedDate.toISOString(),
    createdAt: new Date().toISOString()
  };
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});