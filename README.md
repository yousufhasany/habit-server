# Habit Tracker Server

Backend API for the Habit Tracker application built with Express.js and MongoDB.

## Features

- JWT-based authentication
- Protected routes with middleware
- CRUD operations for habits
- Habit completion tracking with streak calculation
- User-specific habit filtering
- Public habits browsing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your credentials:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: Server port (default: 5000)

4. Start the server:
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

## API Routes

### Authentication
- `POST /jwt` - Generate JWT token

### Habits
- `POST /habits` - Create new habit (Protected)
- `GET /habits/public` - Get all public habits
- `GET /habits?userEmail={email}` - Get user's habits (Protected)
- `GET /habits/:id` - Get single habit (Protected)
- `PUT /habits/:id` - Update habit (Protected)
- `DELETE /habits/:id` - Delete habit (Protected)
- `PUT /habits/:id/complete` - Mark habit complete (Protected)
- `PATCH /habits/:id/complete` - Alternative complete endpoint (Protected)

### Protected Routes

Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Data Models

### Habit
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "category": "string",
  "reminderTime": "string",
  "imageUrl": "string",
  "userEmail": "string",
  "userName": "string",
  "currentStreak": "number",
  "completionHistory": ["date"],
  "isPublic": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Streak Calculation

The server automatically calculates streaks based on consecutive day completions in the `completionHistory` array.

## Security

- JWT tokens expire after 7 days
- Protected routes verify token validity
- Users can only modify their own habits
- Email verification in token payload
