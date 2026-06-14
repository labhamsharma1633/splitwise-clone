# Splitwise Clone

A full-stack expense sharing application inspired by Splitwise.

## Features

* User Authentication (JWT)
* Create and manage groups
* Add and manage expenses
* Support for EQUAL, UNEQUAL, PERCENTAGE and SHARE splits
* Group and individual balances
* Settlements between users
* CSV import with anomaly detection
* Import reports
* Real-time chat using Socket.IO

## Tech Stack

* Frontend: React.js, Vite
* Backend: Node.js, Express.js
* Database: PostgreSQL (Neon)
* ORM: Prisma
* Authentication: JWT
* Deployment: Vercel and Render

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

Frontend:

```env
VITE_API_URL=
```

## Live Links

Frontend: YOUR_VERCEL_URL

Backend: YOUR_RENDER_URL

## AI Tools Used

* ChatGPT
* GitHub Copilot
