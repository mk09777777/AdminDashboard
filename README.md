# Food Order Admin Dashboard

A React-based admin dashboard for managing the food ordering platform.

## Features

- **Trendy Items Management**: Add, edit, and delete trendy items for the home page
- **Banner Management**: Manage home page banners with images and links
- **Restaurant Management**: View and manage restaurant status (activate/deactivate)
- **Secure Authentication**: JWT-based admin authentication
- **Responsive Design**: Works on desktop and mobile devices

## Setup

### 1. Install Dependencies
```bash
cd admin-dashboard
npm install
```

### 2. Start Development Server
```bash
npm start
```

The admin dashboard will be available at `http://localhost:3000`

### 3. Default Admin Credentials
- Email: `admin@foodorder.com`
- Password: `admin123`

## Backend Connection

The dashboard connects to the backend API at `http://localhost:5000/api`

Make sure the backend server is running before using the admin dashboard.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run dev` - Start development server (alias)

## API Endpoints Used

- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/trendy-items` - Get trendy items
- `POST /api/admin/trendy-items` - Create trendy item
- `PUT /api/admin/trendy-items/:id` - Update trendy item
- `DELETE /api/admin/trendy-items/:id` - Delete trendy item
- `GET /api/admin/banners` - Get banners
- `POST /api/admin/banners` - Create banner
- `PUT /api/admin/banners/:id` - Update banner
- `DELETE /api/admin/banners/:id` - Delete banner
- `GET /api/admin/restaurants` - Get restaurants
- `PUT /api/admin/restaurants/:id/status` - Update restaurant status

## Technology Stack

- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Local Storage for authentication