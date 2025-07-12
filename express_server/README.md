# 🚗 Carpool Booking System – API Documentation

📅 Cập nhật lần cuối: 2025-04-10

---

## 📖 Mục lục

- [1. Giới thiệu](#1-giới-thiệu)
- [2. Cài đặt nhanh](#2-cài-đặt-nhanh)
- [3. Quy ước API](#3-quy-ước-api)
- [4. Authentication](#4-authentication)
- [5. Modules](#5-modules)
  - [5.1 Auth](#51-auth)
  - [5.2 Rides](#52-rides)
  - [5.3 Users](#53-users)
  - [5.4 Drivers](#54-drivers)
  - [5.5 Admin](#55-admin)
- [6. DTO Definitions](#6-dto-definitions)

---

## 1. Giới thiệu

Đây là tài liệu API cho **Carpool Booking Server**, phục vụ cho:

- App Khách (React Native)
- App Tài xế (React Native)
- Trang Web Quản trị (React + TS)

Backend sử dụng:

- Node.js + TypeScript
- Kiến trúc MVC
- MongoDB (Replica Set + Auth)
- Docker

---

## 2. Cài đặt nhanh

```bash
# Clone repo
git clone <your-repo-url>
cd <project-folder>

# Cài dependencies
npm install

# Tạo file .env từ .env.example và chỉnh sửa theo cấu hình
cp .env.example .env

# Chạy MongoDB (nếu dùng Docker)
docker compose up -d

# Khởi động server (dev mode)
npm run dev
```

---

## 3. Quy ước API

- Tất cả request/response đều dùng JSON.
- `Authorization: Bearer <token>` dùng cho các route yêu cầu đăng nhập.
- Format giờ: `ISO 8601`
- Mọi response sẽ có base format:

```json
{
  "status": "success" | "error",
  "message": "Mô tả kết quả",
  "data": { ... },
  "error": { ... }  // nếu có
}
```

---

## 4. Authentication

### POST `/auth/login`

- **Mô tả:** Đăng nhập user (Customer/Driver/Admin)

#### Request

```json
{
  "email": "string",
  "password": "string"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "string",
      "role": "customer" | "driver" | "admin",
      "name": "string"
    }
  }
}
```

---

## 5. Modules

### 5.1 Auth

- `POST /auth/login` – Đăng nhập
- `POST /auth/register` – Đăng ký
- `POST /auth/logout` – Đăng xuất

### 5.2 Rides

- `POST /rides/book` – Tạo yêu cầu đặt chuyến
- `GET /rides/:id` – Lấy thông tin chuyến đi
- `PATCH /rides/:id/cancel` – Hủy chuyến đi

### 5.3 Users

- `GET /users/:id` – Lấy thông tin người dùng
- `PUT /users/:id` – Cập nhật hồ sơ

### 5.4 Drivers

- `GET /drivers/nearby?lat=...&lng=...` – Tìm tài xế gần đó
- `PATCH /drivers/:id/status` – Cập nhật trạng thái online/offline

### 5.5 Admin

- _(Bổ sung sau nếu có)_

---

## 6. DTO Definitions

### 📍 LocationDto

```ts
{
  "lat": number,
  "lng": number,
  "address": "string"
}
```

### 🚘 RideDto

```ts
{
  "id": "string",
  "customerId": "string",
  "driverId": "string | null",
  "origin": LocationDto,
  "destination": LocationDto,
  "status": "pending" | "accepted" | "ongoing" | "completed" | "cancelled",
  "scheduledTime": "ISO8601",
  "createdAt": "ISO8601"
}
```

### 👤 UserDto

```ts
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "customer" | "driver" | "admin"
}
```
