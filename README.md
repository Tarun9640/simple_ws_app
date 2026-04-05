# Simple websocket application

## Overview

This project implements a minimal backend system with:

* JWT-based authentication
* Protected HTTP APIs
* Authenticated WebSocket messaging using Socket.IO
* Real-time user-to-user messaging

---

# Tech Stack

* Node.js (ES6)
* Express.js
* PostgreSQL (Sequelize)
* Socket.IO
* JWT (Authentication)
* bcrypt (Password hashing)

---

# Setup Instructions

## 1. Clone Repository
git clone <your-repo-url> 
cd <project-folder>

---

## 2. Install Dependencies
npm install

## 3. Create .env File
cp .env.example .env

## 4. Start Server
npm run dev


## Server will run at:
http://localhost:3000

# Authentication APIs

## 1. Signup
POST /api/auth/signup
Payload
json
{
  "first_name": "Tarun",
  "email": "tarun@test.com",
  "password": "123456"
}


## 2. Login
POST /api/auth/login
payload 
json
{
  "email": "tarun@test.com",
  "password": "123456"
}

## 3. Get Current User
GET /api/auth/me

Headers:
Authorization: Bearer JWT_TOKEN

# Testing Steps

## HTTP APIs

* Use Postman
* Test signup → login → protected route

## WebSocket

* Use browser / Postman Socket.IO
* Open two clients with different tokens
* Send message between users

# Design Decisions

## 1. Authentication

* JWT used for stateless authentication
* Tokens include expiry for security
* Passwords hashed using bcrypt

## 2. WebSocket Authentication

* JWT verified during Socket.IO handshake
* Unauthorized users are rejected before connection

## 3. Active Users Management

* In-memory Map used to track active users
* Supports multiple connections per user using Set userId → Set(socketIds)

## 4. Messaging Logic

* Messages delivered only if recipient is online
* Offline users handled gracefully with error response

## 5. Error Handling

* Centralized error handling using middleware
* Custom error class for structured errors

# Edge Cases Handled

* Invalid JWT during connection
* Expired tokens
* User disconnect cleanup
* Multiple connections per user
* Offline user messaging

# Future Improvements

* Redis for multi-server scaling (Pub/Sub)
* Message persistence (database)
* Read receipts / delivery status
* Rate limiting & security enhancemenent

# Summary

This project demonstrates:

* Clean architecture (Controller → Service → DB)
* Secure authentication system
* Real-time messaging with WebSocket
* Production-level error handling
* Scalable design approach

# Author
Tarun Kumar
