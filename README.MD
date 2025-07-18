# 🚗 Carpool Booking System

This project is a full-stack carpool booking platform designed to help customers share trips efficiently and affordably. It includes a mobile app for riders and drivers, an admin web panel, and a scalable backend with smart trip-matching logic.

---

## 🔧 Technologies Used

### 📱 Mobile Apps (React Native)

- `carpool_rider`: Rider app using Expo + TypeScript
- `carpool_driver`: Driver app using Expo + TypeScript
- Features: booking, trip tracking, notifications, real-time updates

### 🖥️ Web Admin Panel (React + TypeScript)

- `express_control`: Admin dashboard for managing users, trips, finances, and configurations
- Features: search, filters, role-based access, multilingual support

### 🧠 Backend Server (Node.js + Express + TypeScript)

- `express_server`: Main API server following MVC structure
- MongoDB with replica set (Docker)
- Redis for caching, route matching, and geo computation
- RESTful APIs with token-based authentication (access/refresh)
- Push notification system with Expo

---

## 📦 Key Features

- Smart trip suggestion with distance/time validation (Goong API)
- Schedule-based route assignment for drivers
- Booking management and seat availability check
- Location stored in GeoJSON format
- Real-time status updates via WebSocket
- Admin-level action audit and report system

---

## 🚀 Getting Started

```bash
# Clone repo
git clone https://github.com/Phan-Van-Tuan/Carpool-system.git
cd Carpool-system

# Install and run backend
cd express_server
npm install
npm run dev

# Run Rider app
cd ../carpool_rider
npm install
npx expo start

# Run Driver app
cd ../carpool_driver
npm install
npx expo start

# Run Web Admin
cd ../express_control
npm install
npm run dev
```

## 📌 Notes

- Requires MongoDB replica set + Redis running via Docker
- Goong API is used for geolocation & route distance calculation
- .env files are required for each app (.env.example provided if needed)
- Supports custom trip schedules (even days, odd days, etc.)

## 👨‍💻 Author

Phan Van Tuan — Graduation Thesis, 2025
Supervisor: ThS. Thai Thi Than Van
