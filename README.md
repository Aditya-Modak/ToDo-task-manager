# Todo Task Manager (Major Project — MERN Stack)

## Objective
A full-stack task management application that enables users to create, track, update, and delete todos with persistent storage, search, filtering, and priority tagging.

## Description
Todo Task Manager is built using the MERN stack (MongoDB, Express.js, React, Node.js). The application supports structured task input including a required **title** and optional **description**, along with status toggling for completion. Data is stored persistently using MongoDB Atlas, ensuring tasks are available across sessions.

The UI provides:
- Real-time updates after every operation
- Search across titles and descriptions
- Filtering by task state (All, Active, Completed)
- Priority-based visual badges (Low, Medium, High)
- Smooth motion animations using **Framer Motion**
- Modern gradient-based styling and responsive grid layout

Backend API handles validation, error responses, and CRUD operations using Express and Mongoose.

## Repository
GitHub Repository Link: *(Add your GitHub link after upload is complete)*

## Technologies Used
### Frontend
- React 18 (Strict Mode enabled)
- Vite Bundler
- Framer Motion (animations)
- Axios (API communication)
- React Icons (UI symbols)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose (ODM)
- CORS & dotenv (environment configuration)

## Setup Instructions
### Backend
```sh
cd backend
npm install
npm run dev
```
### Frontend
```sh
cd frontend
npm install
npm run dev
```
### Features Implemented

Feature	Status
Create todo (title + description)
View all todos	
Toggle complete/incomplete	
Delete todo	
MongoDB persistence	
Load on page refresh	
Real-time UI updates	
Search	
Filter panel	
Priority UI badges

### Challenges Solved

MongoDB connection timeout handling

Merge conflicts in project files

Port mismatch resolution between backend and frontend

Real-time UI sync without manual reload