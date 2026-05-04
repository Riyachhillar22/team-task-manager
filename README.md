# Team Task Manager API

Hi,  
This is a backend project I built to manage tasks with authentication. The goal was to create a simple and practical system where users can register, log in, and manage their tasks securely.

---

## What this project does

- Allows users to register and log in  
- Uses JWT authentication to secure routes  
- Users can create, update, and delete tasks  
- Only authorized users can access their own data  

---

## Technologies used

Node.js  
Express.js  
MongoDB (Mongoose)  
JWT for authentication  
bcrypt for password hashing  

---

## API Routes

Authentication

POST /api/auth/signup → create account  
POST /api/auth/login → login user  

Tasks

GET /api/tasks → get all tasks  
POST /api/tasks → create a task  
PUT /api/tasks/update/:id → update a task  
DELETE /api/tasks/:id → delete a task  

---

## Deployment

This project is deployed on Railway.

---

## Why I built this

I wanted to practice backend development and understand how authentication works in real applications. This project helped me learn how to connect a database, secure APIs, and build a complete backend system.

---

## Author

Riya  
BTech CSE (Cybersecurity)# team-task-manager
