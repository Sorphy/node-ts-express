# Node-TS-Express API

A robust REST API built with Node.js, Express, and TypeScript, featuring user authentication, MySQL integration, and JWT token management.

## Features

- **TypeScript Integration**: Full TypeScript support for better type safety and developer experience.
- **Express Framework**: Fast, unopinionated web framework for Node.js.
- **MySQL Database**: Secure data persistence using MySQL.
- **JWT Authentication**: Token-based user authentication and authorization.
- **Password Hashing**: Secure password storage using bcrypt.
- **Environment Configuration**: Easy environment variable management with dotenv.
- **Request Validation**: Input validation for API endpoints.
- **Error Handling**: Basic error handling implemented for specific cases.
- **Connection Pooling**: Efficient database connection management.

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher).
- **MySQL Server**.
- **npm** package manager.
- **TypeScript** installed globally (`npm install -g typescript`).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sorphy/node-ts-express.git
   cd node-ts-express
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:

   ```env
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   TOKEN_SECRET=your_jwt_secret_key
   TOKEN_EXPIRY=24h
   PORT=3000
   ```

4. Create the necessary database tables using the provided SQL scripts.

## Database Setup

Create the following table in your MySQL database:

```sql
CREATE TABLE register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    insertdatetimeutc TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Application

### Development mode (with hot reload):

```bash
npm run dev
```

### Production mode:

```bash
npm run build
npm run start
```

## API Endpoints

### User Management

#### Register User

**POST** `/users/register`

Creates a new user account.

**Body:**

```json
{
    "email": "user@example.com",
    "phone": "1234567890",
    "password": "securepassword"
}
```

#### Login

**POST** `/users/login`

Authenticates a user and returns a JWT token.

**Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword"
}
```

#### Batch Create Users (Protected Route)

**POST** `/users/create100users`

Creates multiple user accounts (requires authentication).

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```plaintext
src/
├── config/
│   ├── auth.token.ts         # authentication middleware
│   └── db.config.ts         # Database configuration
│   └── token.generate.ts    # JWT token generation
├── routes/
│   ├── index.ts             
│   └── user.routes.ts       # User-related routes
└── index.ts                 # Application entry point
```

## Security Features

- **Password hashing** using bcrypt.
- **JWT-based authentication**.
- **SQL injection protection** through prepared statements.
- **Environment variable configuration**.
- **Connection pooling** for database security.

## Error Handling

Basic error handling includes:

- Database connection errors.
- Authentication failures.
- Invalid input data.
- Server errors.
- JWT verification errors.

Note: Centralized error-handling middleware is not implemented in this repository but can be added to improve scalability.

## Development Tools

- **nodemon**: For automatic server restart during development.
- **ts-node**: For running TypeScript files directly.
- **dotenv**: For environment variable management.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For JWT token management.

## Best Practices Implemented

### Type Safety

- Strong typing with TypeScript.
- Interface definitions for request/response objects.

### Security

- Encrypted password storage.
- Token-based authentication.
- Protected routes.
- Secure database queries.

### Code Organization

- Modular route handling.
- Separated configurations.

### Database Management

- Connection pooling.
- Prepared statements.
- Basic error handling.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

[Sofiyyah Abidoye](https://github.com/Sorphy)

## Acknowledgments

- Express.js team.
- TypeScript team.
- MySQL team.
- apicache team.
- All other open-source contributors.

## Support

For support, email [sofiyyahabidoye@gmail.com] or open an issue in the GitHub repository.
