# User Registration and Login System with Email Verification

This project provides a Node.js-based user registration and login system with separate customer and admin roles. It includes email verification using `nodemailer` and JWT-based authentication for secure login.

## Features

- **Customer Registration:** Register new customers with role `customer`.
- **Admin Registration:** Register new admins with role `admin`.
- **Email Verification:** Users receive an email verification link upon registration.
- **Admin and Customer Login:** Admin and customer users can log in using their credentials.
- **Role-Based Access:** Admin users can log in from the admin login route; customers can log in from the customer login route.
- **Error Handling:** Centralized error handling for consistent API responses.

## Requirements

- Node.js
- MySQL

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/shyamgupta5555/shyamgupta5555-techeruditetask.git
    ```

2. Branch master


3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up your MySQL database and configure the environment variables.

5. Run migrations to create necessary tables:

    ```bash
    npx sequelize db:migrate
    ```

6. Start the application:

    ```bash
    npm start
    ```

## Environment Variables


```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=test
JWT_SECRET=your_jwt_secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
BASE_URL=http://localhost:4040
