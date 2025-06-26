const express = require('express');
const app = express();
const port = 3000;

let tasks = require('./task_new.json').tasks;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Task Manager API is running");
});

// Validate task input
function validateTaskInput({ title, description, completed, priority }) {
    if (typeof title !== 'string' || title.trim() === '') {
        return "Title must be a non-empty string";
    }
    if (typeof description !== 'string' || description.trim() === '') {
        return "Description must be a non-empty string";
    }
    if (typeof completed !== 'boolean') {
        return "Completed must be a boolean";
    }
    if (!['low', 'medium', 'high'].includes(priority)) {
        return "Priority must be one of: low, medium, high";
    }
    return null;
}

// Retrieve all tasks
app.get("/api/v1/tasks",(req,res) => {
    let result = [...tasks];

    // Filter by completed=true/false
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        result = result.filter(task => task.completed === completed);
    }

    // Sort by createdAt
    if (req.query.sort === 'createdAt') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return res.send(result);
});

// Retrieve a specific task by its ID
app.get("/api/v1/tasks/:id",(req,res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === parseInt(taskId));
    if(!task){
        return res.status(404).send({"message": `Task: ${taskId} not found`});
    }
    return res.send(tasks[taskId]);
});

// Retrieve tasks by priority level
app.get("/api/v1/tasks/priority/:level", (req, res) => {
    const level = req.params.level;
    if (!['low', 'medium', 'high'].includes(level)) {
        return res.status(400).send({ message: "Invalid priority level" });
    }

    const filtered = tasks.filter(t => t.priority === level);
    return res.send(filtered);
});

// Create a new task with the required fields (title, description, completed) + createdAt + priority
app.post("/api/v1/tasks", (req, res) => {
    const error = validateTaskInput(req.body);
    if (error) {
        return res.status(400).send({ message: error });
    }

    const { title, description, completed, priority } = req.body;
  
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title: title.trim(),
        description: description.trim(),
        completed,
        priority,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    return res.status(201).send(newTask);
});

// Update an existing task by its ID
app.put("/api/v1/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));

    if (taskIndex === -1) {
      return res.status(404).send({ message: `Task: ${taskId} not found`});
    }

    const updatedData = req.body;
    const existingTask = tasks[taskIndex];

    // Allow partial updates, but validate if fields are provided
    if ('title' in updatedData && (typeof updatedData.title !== 'string' || updatedData.title.trim() === '')) {
        return res.status(400).send({ message: "Title must be a non-empty string" });
    }
    if ('description' in updatedData && (typeof updatedData.description !== 'string' || updatedData.description.trim() === '')) {
        return res.status(400).send({ message: "Description must be a non-empty string" });
    }
    if ('completed' in updatedData && typeof updatedData.completed !== 'boolean') {
        return res.status(400).send({ message: "Completed must be a boolean" });
    }
    if ('priority' in updatedData && !['low', 'medium', 'high'].includes(updatedData.priority)) {
        return res.status(400).json({ message: "Priority must be one of: low, medium, high" });
    }

    tasks[taskIndex] = {
        ...existingTask,
        ...updatedData
    };
    return res.send(tasks[taskIndex]);
});

// Delete a task by its ID
app.delete("/api/v1/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const initialLength = tasks.length;

  tasks = tasks.filter(t => t.id !== parseInt(taskId));

  if (tasks.length === initialLength) {
    return res.status(404).send({ message: `Task: ${taskId} not found` });
  }

  return res.send({ message: `Task ${taskId} deleted successfully` });
});

// Error handling for unexpected routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;
