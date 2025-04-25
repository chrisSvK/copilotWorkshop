import React, { useState, useEffect } from 'react';

function useDataFetching(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

function TaskForm({ onTaskCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate }),
      });
      
      const newTask = await response.json();
      onTaskCreate(newTask);
      
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Task</h3>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <button type="submit">Create Task</button>
    </form>
  );
}

function App() {
  const [message, setMessage] = React.useState('');
  const [tasks, setTasks] = useState([]);
  const { data: userData, loading, error } = useDataFetching('/api/users/1');

  React.useEffect(() => {
    fetch('/api/message')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const sortTasksByDueDate = (taskList) => {
    return [...taskList].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  return (
    <div>
      <h1>React Frontend</h1>
      <p>{message}</p>
      
      {loading ? (
        <p>Loading user data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : userData && (
        <div>
          <h2>User Profile</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
      
      <TaskForm onTaskCreate={handleTaskCreated} />
      
      {tasks.length > 0 && (
        <div>
          <h2>Your Tasks</h2>
          <ul>
            {sortTasksByDueDate(tasks).map(task => (
              <li key={task.id}>
                <strong>{task.title}</strong> - Due: {task.dueDate || 'No due date'}
                <p>{task.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function exampleSearchFunction() {
  console.log('This is an example function for search demonstration.');
}

export default App;