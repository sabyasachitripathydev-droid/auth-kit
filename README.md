# 🔐 AuthKit – Production-Grade Authentication API

AuthKit is a **production-style authentication and authorization API** built with **Node.js, TypeScript, Express, Sequelize, and MySQL**.  
It demonstrates secure authentication flows, clean service-layer architecture, transactional integrity, and structured logging.

This project is designed as a **reusable backend authentication module**, focusing on correctness, security, and maintainability rather than UI.

---

## 🚀 Features

### Authentication & Authorization
- User registration with **email verification**
- Secure login using **JWT access tokens**
- **Refresh token rotation** with database-backed revocation
- Logout with refresh token invalidation
- Password reset using **hashed, expiring, one-time tokens**
- Token type validation (access / refresh / email verification)

### Security
- Password hashing using `bcrypt`
- Hashed password reset tokens (never stored in plain text)
- Token expiry enforcement
- Transactional operations for critical flows
- Explicit token revocation strategy

### Logging & Auditing
- **HTTP access logging** using Morgan (rotating files)
- **Application-level structured logging** using Pino
- Login activity tracking (IP address & user-agent)
- Clear separation between access logs, application logs, and audit logs

### Architecture
- Controllers → Services → Models separation
- Centralized error handling
- Request validation using `express-validator`
- DTOs for typed request bodies
- Database transactions for consistency

---

## 🏗 Project Architecture

```text
src/
├── app.ts
├── server.ts
├── routes/
│   ├── auth.route.ts
│   └── user.route.ts
├── controllers/
│   ├── auth.controller.ts
│   └── user.controller.ts
├── services/
│   ├── auth.service.ts
│   └── user.service.ts
├── database/
│   ├── db.ts
│   └── models/
│       ├── users.ts
│       ├── refresh_tokens.ts
│       ├── password_reset_tokens.ts
│       ├── login_activities.ts
│       └── email_verify_tokens.ts
├── middlewares/
│   ├── authenticateUser.ts
│   ├── errorHandler.ts
│   ├── logger.ts
│   └── validate.ts
├── utils/
│   ├── application-logging.ts
│   ├── tokens.ts
│   ├── email.ts
│   └── error.ts
├── validationRules/
└── dto/
```

---

## 🔑 Authentication Flow Overview

### Login
1. Validate credentials
2. Generate JWT access token
3. Generate and store refresh token
4. Track login activity (IP & user-agent)
5. Return access + refresh tokens

### Refresh Login
1. Verify refresh token
2. Revoke old refresh token
3. Issue new access + refresh tokens

### Logout
1. Validate refresh token
2. Revoke refresh token in database

---

## 🗄 Database Design

### Tables
- `users`
- `refresh_tokens`
- `password_reset_tokens`
- `login_activities`
- `email_verify_tokens`

### Key Design Decisions
- Refresh tokens are stored and revocable
- Password reset tokens are hashed and single-use
- Login activities are immutable audit records
- All user-related tokens are associated via foreign keys

---

## 📊 Logging Strategy

| Type | Tool | Purpose |
|----|----|----|
| Access Logs | Morgan | HTTP request/response lifecycle |
| Application Logs | Pino | Business-level events |
| Audit Logs | MySQL | Login activity tracking |

Application logs are structured JSON logs with contextual metadata such as:
- service name
- method name
- user ID
- error details

---

## 🧪 Validation

All incoming requests are validated using `express-validator`:
- Required fields enforced
- Proper data formats ensured
- Early rejection of invalid requests
- Clean controllers without validation logic

---

## ⚙️ Environment Variables

Create a `.env` file based on the following:

```env
APP_PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=authkit
DB_USERNAME=root
DB_PASSWORD=

TOKEN_SECRET=your_jwt_secret

SMPT_USER=your_email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
APP_EMAIL=your_email@gmail.com
APP_EMAIL_PASS=your_email_app_password
```

---

## ▶️ Running the Project

```bash
npm install
npm run build
npm run start
```

---

## 📌 Notes

- This project focuses on **backend authentication correctness**, not frontend UI.
- Designed to be used as a base AuthKit or learning reference.
- All critical flows are transaction-safe and logged.
- Suitable for showcasing backend engineering skills.

---

## 🎯 Final Statement

This AuthKit demonstrates:
- Real-world authentication patterns
- Secure token lifecycle management
- Clean backend architecture
- Proper logging and auditing
- Production-oriented thinking

