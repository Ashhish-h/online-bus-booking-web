# bookMyBus - Online Bus Booking Website

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for online bus ticket booking.

## Features

### User Features
- User registration and authentication
- Search buses by source, destination, and date
- View bus details and available seats
- Book tickets with passenger details
- View booking history
- Cancel bookings
- Profile management

### Admin Features
- Manage buses (add, edit, delete)
- View all bookings
- Manage users
- Update booking statuses
- Dashboard with statistics

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI** - UI components
- **React Hook Form** - Form handling
- **Date-fns** - Date utilities

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bookmybus
```

2. Install dependencies:
```bash
npm install
```
```

3. Start the server:
```bash
npm run server
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Running Both (Development)

From the root directory:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get user data

### Buses
- `GET /api/buses/search` - Search buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `POST /api/buses` - Create bus (Admin)
- `PUT /api/buses/:id` - Update bus (Admin)
- `DELETE /api/buses/:id` - Delete bus (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/create-admin - to create admin`

## Project Structure

```
bookmybus/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Bus.js
│   └── Booking.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── buses.js
│   ├── bookings.js
│   └── users.js
├── middleware/             # Custom middleware
│   └── auth.js
├── server.js              # Express server
├── package.json
└── README.md
```

