# Lendsqr Backend Test API

Welcome to the Lendsqr Backend Test API documentation! This document provides an overview of the API, including setup instructions, available endpoints, and an entity-relationship (E-R) diagram to help you understand the database structure.

## Table of Contents

1. [Introduction](#introduction)
2. [Setup Instructions](#setup-instructions)
3. [Database Configuration](#database-configuration)
4. [Available Endpoints](#available-endpoints)
5. [E-R Diagram](#e-r-diagram)
6. [License](#license)

## Introduction

The Lendsqr Backend Test API is a backend service for managing users and their financial transactions. It provides functionalities for creating users, checking if a user exists, updating user balances, transferring funds between users, and deducting balances from users.

## Setup Instructions

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MySQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/lendsqr-backend.git
cd lendsqr-backend

2. Install dependencies:

npm install

3.  Create a .env file in the root directory and add the following environment variables:

DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=your-database-port
KARMA_API_KEY=your-karma-api-key
KARMA_API_URL=your-karma-api-url
PORT=your-desired-port


### Running the Application
1.  create tables:
npx knex migrate:make users_table --knexfile src/knexfile.ts
npx knex migrate:make token_table --knexfile src/knexfile.ts

2.  Run database migrations:
npx knex migrate:latest

3.  Start the server:
npm run dev

The server should now be running on http://localhost:8080.

## Database Configuration
The database configuration is defined in the knexfile.js file. It includes separate configurations for development, testing, and production environments.

### Available Endpoints
User Endpoints
1. Register User
POST /register

Request Body:

{
  "email": "test@example.com",
  "password": "password"
}

Response:
{
  "message": "User registered successfully",
  "token": "token-generated_token"
}

2.  Fund Account

POST /fund

Headers:
Authorization: <token-generated_token>

Request Body:
{
  "userId": 1,
  "amount": 100
}

Response:

{
  "message": "Account funded successfully"
}

3.  Transfer Funds

POST /transfer
Headers:
Authorization: <token-generated_token>

Request Body:

{
  "fromUserId": 1,
  "toUserId": 2,
  "amount": 50
}

Response:

{
  "message": "Transfer successful"
}

4.  Withdraw Funds
POST /withdraw
Headers:
Authorization: <token-generated_token>

Request Body:
{
  "userId": 1,
  "amount": 20
}
Response:
{
  "message": "Withdrawal successful"
}

## E-R Diagram
![Alt text](https://ibb.co/R2zxngL)



Tool: DB Designer.

E-R Diagram Details
The E-R diagram for the Lendsqr API consists of two main entities: users and tokens.

### Users Table
id: Primary key, auto-incremented.
email: Unique, not nullable.
password: Not nullable.
balance: Decimal, default is 0.

### Tokens Table
token: Primary key.
email: Not nullable, references the email in the users table.

