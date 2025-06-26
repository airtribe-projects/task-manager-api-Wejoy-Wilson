# Task Manager API
A RESTful API built using Node.js and Express.js to manage tasks in-memory. This project supports full CRUD operations, validation, filtering, sorting, and priority-based retrieval.

---

## Project Structure
```
task-manager-api/
│
├── app.js              # Main API server
├── task_new.json           # In-memory data storage
├── package.json
└── README.md           # API documentation
```

---

## Setup Instructions
1. Install dependencies
   ```
   npm install
   ```
2. Start the server
   ```
   node app.js
   ```
3. Server will run at:
   `http://localhost:3000/`

---

## Data Format (`task_new.json`)
    **Updated the task.json file**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true,
      "priority": "medium",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

## 📌 API Endpoints

### `GET /api/v1/tasks`
Returns all tasks  
Supports filters and sorting:
- `/api/v1/tasks?completed=true`
- `/api/v1/tasks?sort=createdAt`

---

### `GET /api/v1/tasks/:id`
Returns a single task by ID  
**Example:**  
`/api/v1/tasks/1`

---

### `GET /api/v1/tasks/priority/:level`
Returns tasks by priority level: `low`, `medium`, or `high`  
**Example:**  
`/api/v1/tasks/priority/high`

---

### `POST /api/v1/tasks`
Create a new task  
**Body Example:**
```json
{
  "title": "Create a API for Course addition/updation/deletion/listing",
  "description": "Complete the instllation and code",
  "completed": false,
  "priority": "high"
}
```

✅ Validation:
- Title and description must be non-empty strings
- Completed must be a boolean
- Priority must be one of: `low`, `medium`, `high`

---

### `PUT /api/v1/tasks/:id`
Update a task by ID  
**Example:**  
`/api/v1/tasks/1`

**Partial or full update allowed**

```json
{
  "completed": true,
  "priority": "medium"
}
```

---

### `DELETE /api/v1/tasks/:id`
Deletes a task by ID  
**Example:**  
`/api/v1/tasks/3`

---

### Error Handling

- `404`: Task not found / Invalid route
- `400`: Validation errors for input fields

---

## Testing the API

You can use tool:
- [Postman](https://www.postman.com/)

---
