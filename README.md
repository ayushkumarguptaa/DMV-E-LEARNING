# DMV Learning Platform

The **DMV Learning Platform** is a full-stack web application built to deliver **online technology courses** along with **interactive quizzes in full-screen mode**.  
The project focuses on creating a structured, distraction-free learning environment where users can learn, practice, and evaluate their knowledge effectively.

This platform is designed as an academic project and demonstrates real-world implementation of modern web technologies.

---

## Project Overview

Online learning platforms often provide content but lack a focused assessment environment. Learners get distracted during tests or do not get proper feedback on their performance.

The DMV Learning Platform solves this problem by:
- Providing structured **technology-based courses**
- Offering **video lectures** for better understanding
- Enforcing **full-screen quiz mode** to simulate real exam conditions
- Tracking user progress and quiz attempts

---

## Project Objectives

- To build a **technology learning platform**
- To provide **full-screen, distraction-free quizzes**
- To implement a secure **backend system**
- To separate **User Panel** and **Admin Panel**
- To track user performance and learning progress

---

## Platform Functionality

### User Panel
Users can:
- Register and log in securely
- Access available technology courses
- Watch video lectures
- Attempt quizzes after completing lessons
- Take quizzes in **mandatory full-screen mode**
- View quiz scores and attempt history
- IMplemented razorpay payment gateway
- also implemented mail system to user when enroll in courses
- user can't able to enroll in that courses in which they have already enrolled

### Admin Panel
Admins can:
- Manage courses, quizzes, add instructor,add pop up  etc
- Control learning content
- Monitor user activity

---

## Technology used

### Frontend
- React.js  
- TypeScript  
- HTML5 & CSS3  
- Axios  
- React Router  

### Backend
- Node.js  
- Express.js  
- REST APIs  

### Database
- Postgres  

### Utilities & Tools
- JWT Authentication  
- Fullscreen API  
- Nodemailer  
- Razorpay (if payments are enabled)  

---

## 📂 Project Structure

DMV-Learning/
│
├── client/ # Frontend
│ ├── components/ # Complete User Panel code
│ │
│ ├── admin/
│ │ └── pages/ # Admin Panel files and pages
│ │
│ ├── services/
│ ├── hooks/
│ ├── styles/
│ └── App.tsx
│
├── server/ # Backend
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── utilities/ # Helper and utility files
│ ├── database/
│ └── server.js # Backend entry point
│
├── .env
├── package.json
└── README.md


Backend Setup ->
npm install
node server/server.js

Frontend Setup ->
npm install
npm run dev

