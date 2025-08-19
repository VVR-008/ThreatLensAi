# ThreatLensAI - AI-Powered Cybersecurity Threat Detection

A comprehensive cybersecurity platform with AI-powered phishing detection and threat analysis.

## Features

- **Authentication System**: Secure user registration and login with JWT tokens
- **URL Scanner**: Deep scanning of URLs to detect phishing attempts and malware
- **Screenshot Analyzer**: AI-powered visual analysis for fake login pages
- **Real-time Monitoring**: Continuous threat detection and alerts
- **Dashboard**: Comprehensive security overview and analytics

## Setup

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   # MongoDB Connection String
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/threatlensai?retryWrites=true&w=majority
   
   # JWT Secret Key (generate a strong random string)
   JWT_SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random
   
   # Optional: Environment
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Authentication

The application uses JWT tokens for authentication with the following features:

- **User Registration**: Secure signup with password hashing
- **User Login**: Email/password authentication
- **Protected Routes**: Dashboard, scanner, and analyzer require authentication
- **Session Management**: Automatic token refresh and logout

## Navigation

- **Landing Page**: Public navigation with sign in/sign up buttons
- **Dashboard**: Authenticated navigation with user profile and logout
- **Responsive Design**: Mobile-friendly navigation for all screen sizes

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- MongoDB injection protection

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt for password hashing
- **State Management**: React Context API

## Project Structure

```
threatlensai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   ├── scanner/           # URL scanner tool
│   ├── analyzer/          # Screenshot analyzer
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── landing-navigation.tsx
│   ├── dashboard-navigation.tsx
│   └── protected-route.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   └── models/           # MongoDB models
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 