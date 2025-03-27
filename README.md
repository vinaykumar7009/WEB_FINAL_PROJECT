# Hospital Management System

A web-based hospital management system built with Node.js, Express, and MongoDB.

## Features

- Appointment Management
- Patient Records
- Feedback System
- User Authentication
- Dashboard Analytics

## Prerequisites

- Node.js >= 14.0.0
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your values:
   - MongoDB Atlas connection string
   - Session secret
   - Admin credentials

## Development

Run the development server:
```bash
npm run dev
```

## Production Deployment

1. Set environment variables:
   - NODE_ENV=production
   - MONGO_URI (MongoDB Atlas connection string)
   - SESSION_SECRET
   - PORT (optional, defaults to 3000)

2. Build and start:
   ```bash
   npm start
   ```

## Database Setup

1. Create MongoDB Atlas account
2. Create new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update .env file with connection string

## Security Notes

- Change default admin credentials
- Use strong SESSION_SECRET
- Enable secure cookies in production
- Keep .env file secure
- Regular security updates

## License

ISC
