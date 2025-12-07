# 🚗 ParkEasy - Car Parking Slot Booking System

A full-stack parking slot booking system with real-time availability updates, QR code check-in, and Google OAuth authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## ✨ Features

### User Features
- 🔐 **Google OAuth Authentication** - Secure login with Google accounts
- 📍 **Real-time Slot Availability** - Live updates using Socket.IO
- 📅 **Time-based Booking** - Book parking slots for specific time windows
- 🎫 **QR Code Check-in** - Generate and scan QR codes for check-in
- 📱 **Booking Management** - View, track, and cancel bookings
- 🔄 **Conflict Prevention** - Database-level locking prevents double bookings

### Admin Features
- 📊 **Analytics Dashboard** - View occupancy statistics and trends
- 🏢 **Parking Lot Management** - CRUD operations for parking facilities
- 🅿️ **Slot Management** - Add, activate, deactivate parking slots
- 📋 **Booking Overview** - Monitor all bookings across facilities

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with UUID support
- **Authentication**: Passport.js (Google OAuth 2.0) + JWT
- **Real-time**: Socket.IO
- **QR Generation**: qrcode library

### Frontend
- **Framework**: React (with React Router)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Project-C
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🗄 Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE parking_booking;

# Exit
\q
```

### 2. Run Database Migration

```bash
cd backend
psql -U postgres -d parking_booking -f schema.sql
```

The schema will create:
- **users** table (with Google OAuth support)
- **parking_lots** table
- **slots** table
- **bookings** table (with conflict prevention constraints)

## ⚙️ Configuration

### 1. Backend Configuration

Create `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parking_booking
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your_session_secret_key
```

### 2. Frontend Configuration

Create `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Create **OAuth 2.0 Credentials**:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. Copy **Client ID** and **Client Secret** to backend `.env`

### 4. Create Admin User

After first Google login, update the user role in database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## 🧪 Testing

### 1. Test Concurrent Booking (Double-Booking Prevention)

Open two browser windows side-by-side:

1. Login with different accounts
2. Select the same parking slot
3. Choose overlapping time ranges
4. Try to book simultaneously
5. **Expected**: Only one booking succeeds, the other receives a conflict error

### 2. Test Real-Time Updates

**Window 1:**
1. Login and navigate to a parking lot
2. Keep the slot view open

**Window 2:**
1. Login and book a slot

**Expected**: Window 1 immediately shows the slot as unavailable (red) without refresh

### 3. Test QR Code Check-in

1. Create a booking
2. View booking details (QR code displayed)
3. Copy the QR code token (right-click QR → inspect → find token in booking object)
4. Test the check-in endpoint:

```bash
curl -X POST http://localhost:5000/api/bookings/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"qrToken": "QR_TOKEN_FROM_BOOKING"}'
```

**Expected**: Booking status changes to "checked_in"

### 4. Test Google OAuth

1. Open http://localhost:3000/login
2. Click "Sign in with Google"
3. Complete Google authentication
4. **Expected**: Redirected to dashboard with token stored in localStorage

### 5. Test Admin Features

1. Login with admin account
2. Navigate to `/admin`
3. Try:
   - Creating a new parking lot
   - Adding slots to parking lot
   - Activating/deactivating slots
   - Viewing analytics

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project:**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel --prod
```

3. **Update environment variables** in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_SOCKET_URL`: Your backend URL

### Backend Deployment (Render/Railway)

1. **Create `Procfile` (for Heroku) or use existing start script**

2. **Set environment variables** in hosting platform:
   - All variables from `.env.example`
   - Update `FRONTEND_URL` to your deployed frontend URL
   - Update `GOOGLE_CALLBACK_URL` to your backend URL + `/api/auth/google/callback`

3. **Update Google OAuth** redirect URIs in Google Console

4. **Deploy PostgreSQL** database (use managed service like:
   - Render PostgreSQL
   - Railway PostgreSQL
   - Supabase
   - AWS RDS

### Database Migration on Production

```bash
# Connect to production database
psql -h <host> -U <user> -d <database> -f schema.sql
```

### CORS Configuration

Update `backend/src/app.js` CORS origin for production:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

## 📁 Project Structure

```
Project-C/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── booking.controller.js   # Booking business logic
│   │   │   └── admin.controller.js     # Admin operations
│   │   ├── middleware/
│   │   │   └── auth.middleware.js      # JWT & role verification
│   │   ├── routes/
│   │   │   ├── auth.routes.js          # Authentication routes
│   │   │   ├── booking.routes.js       # Booking endpoints
│   │   │   └── admin.routes.js         # Admin endpoints
│   │   ├── utils/
│   │   │   └── qr.js                   # QR code generation
│   │   ├── app.js                      # Express & Socket.IO setup
│   │   ├── db.js                       # PostgreSQL connection
│   │   └── auth.js                     # Passport & JWT config
│   ├── schema.sql                      # Database schema
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js                  # Axios setup
│   │   │   ├── auth.js                 # Auth API calls
│   │   │   ├── bookings.js             # Booking API calls
│   │   │   └── admin.js                # Admin API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   └── SlotCard.jsx            # Parking slot display
│   │   ├── hooks/
│   │   │   └── useSocket.js            # Socket.IO hook
│   │   ├── pages/
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── AuthCallback.jsx        # OAuth callback
│   │   │   ├── Dashboard.jsx           # User dashboard
│   │   │   ├── ParkingLot.jsx          # Slot booking view
│   │   │   ├── BookingPage.jsx         # Booking details & QR
│   │   │   └── AdminPanel.jsx          # Admin dashboard
│   │   ├── App.jsx                     # Routes & auth guards
│   │   ├── index.js                    # React entry point
│   │   └── index.css                   # Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 📡 API Documentation

### Authentication Endpoints

#### `GET /api/auth/google`
Initiate Google OAuth flow

#### `GET /api/auth/google/callback`
OAuth callback (redirects to frontend with token)

#### `GET /api/auth/me`
Get current user info
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

### Booking Endpoints (Protected)

#### `GET /api/parking-lots`
Get all parking lots
- **Response**: Array of parking lots with slot counts

#### `GET /api/parking-lots/:lotId/slots?startTime=&endTime=`
Get slots with availability
- **Query**: Optional time range
- **Response**: Array of slots with `is_available` flag

#### `GET /api/bookings?status=`
Get user's bookings
- **Query**: Optional status filter
- **Response**: Array of bookings

#### `GET /api/bookings/:bookingId`
Get booking details with QR code
- **Response**: Booking with QR code data URL

#### `POST /api/bookings`
Create new booking
- **Body**: `{ slotId, startTime, endTime }`
- **Response**: Booking with QR code
- **Conflict Prevention**: Uses PostgreSQL `SELECT ... FOR UPDATE`

#### `PATCH /api/bookings/:bookingId/cancel`
Cancel booking
- **Response**: Success message

#### `POST /api/bookings/check-in`
Check-in with QR code
- **Body**: `{ qrToken }`
- **Response**: Updated booking

### Admin Endpoints (Protected - Admin Only)

#### `GET /api/admin/parking-lots`
Get all parking lots (admin view)

#### `POST /api/admin/parking-lots`
Create parking lot
- **Body**: `{ name, address, description }`

#### `PATCH /api/admin/parking-lots/:lotId`
Update parking lot

#### `DELETE /api/admin/parking-lots/:lotId`
Delete parking lot

#### `GET /api/admin/parking-lots/:lotId/slots`
Get slots (admin view with booking counts)

#### `POST /api/admin/slots`
Create slot
- **Body**: `{ parkingLotId, slotCode, slotType }`

#### `PATCH /api/admin/slots/:slotId`
Update slot (activate/deactivate)
- **Body**: `{ isActive }`

#### `DELETE /api/admin/slots/:slotId`
Delete slot

#### `GET /api/admin/bookings?status=&parkingLotId=`
Get all bookings (admin view)

#### `GET /api/admin/analytics`
Get system analytics and statistics

### Socket.IO Events

#### Client → Server
- `join_parking_lot(parkingLotId)` - Subscribe to lot updates
- `leave_parking_lot(parkingLotId)` - Unsubscribe from lot

#### Server → Client
- `slot_update({ slotId, status, bookingId })` - Broadcast on booking/cancellation

## 🔒 Security Features

1. **JWT Authentication** - Secure API access
2. **Password-less Login** - Google OAuth only
3. **Role-based Access** - Admin vs User permissions
4. **Transaction Locking** - Prevents race conditions
5. **QR Token Expiry** - 24-hour QR code validity
6. **CORS Protection** - Whitelist frontend origin
7. **Input Validation** - Server-side validation

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Ensure database exists: `psql -l`

### Google OAuth Error
- Verify redirect URI matches exactly
- Check client ID and secret
- Ensure Google+ API is enabled

### Socket.IO Not Connecting
- Check CORS configuration
- Verify `REACT_APP_SOCKET_URL` in frontend `.env`
- Check browser console for errors

### Double Booking Still Happening
- Ensure PostgreSQL isolation level is READ COMMITTED
- Check transaction implementation in `booking.controller.js`
- Verify `FOR UPDATE` lock is applied

## 📄 License

This project is for educational/portfolio purposes.

## 👥 Author

Built as a full-stack demonstration project.


## 🙏 Acknowledgments

- React and Node.js communities
- Socket.IO for real-time capabilities
- Tailwind CSS for rapid UI development
- PostgreSQL for robust data management
