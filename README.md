# Splitwise Clone - Frontend

A modern React-based frontend for an expense sharing application with real-time updates and CSV import functionality.

## Features

- User Authentication (Register/Login)
- Create and manage groups
- Add expenses with multiple split types (EQUAL, UNEQUAL, PERCENTAGE, SHARE)
- Real-time expense comments via Socket.IO
- Group and individual balance tracking
- Settlement management
- CSV import with anomaly detection and reporting
- Responsive design
- Protected routes

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Styling**: CSS3

## Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend API running on `https://splitwise-backend-abrn.onrender.com`

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://splitwise-clone-flax-three.vercel.app/
```

### Run Development Server

```bash
npm run dev
```

The frontend will be available at `https://splitwise-clone-flax-three.vercel.app/`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx       - Main dashboard with groups and CSV import
│   ├── GroupDetails.jsx    - Group page with expenses and members
│   ├── Login.jsx          - Login page
│   └── Register.jsx       - Registration page
├── components/
│   ├── Navbar.jsx         - Navigation bar
│   ├── GroupCard.jsx      - Group card component
│   ├── ExpenseCard.jsx    - Expense card with comments
│   ├── BalanceCard.jsx    - User balance display
│   ├── MemberList.jsx     - Group members management
│   ├── SettlementForm.jsx - Settlement recording
│   ├── CreateExpenseModal.jsx - Expense creation modal
│   ├── ChatBox.jsx        - Real-time comments
│   └── ProtectedRoute.jsx - Protected route wrapper
├── services/
│   ├── api.js            - Axios instance with JWT interceptor
│   └── socket.js         - Socket.IO client configuration
├── context/              - Context providers (if any)
├── hooks/                - Custom hooks (if any)
├── App.jsx              - Main app component
├── main.jsx             - Entry point
└── index.css            - Global styles
```

## Key Features

### 1. User Authentication
- JWT token-based authentication
- Token stored in localStorage
- Automatic redirect on 401 Unauthorized

### 2. Expense Management
- Support for 4 split types:
  - **EQUAL**: Split equally among participants
  - **UNEQUAL**: Custom amounts per person
  - **PERCENTAGE**: Percentage-based split
  - **SHARE**: Share-based split
- Real-time balance updates

### 3. Real-time Comments
- Join expense rooms via Socket.IO
- Send and receive comments instantly
- Load historical comments
- User names displayed with comments

### 4. CSV Import
- File picker with `.csv` validation
- Multipart form upload
- Import summary display:
  - Total imported rows
  - Anomaly count
  - Detailed reports table
- Auto-refresh data after import

## API Integration

All API calls use the centralized Axios instance with:
- JWT Authorization header automatically added
- Error handling with user-friendly messages
- 401 response handling (auto-logout)

## Running Tests

Currently no automated tests are included. Manual testing can be performed using:

```bash
npm run dev
```

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```env
VITE_API_URL=https://your-backend-url.com
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## Author

Labham Sharma
