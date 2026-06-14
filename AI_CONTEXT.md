# AI_CONTEXT.md

# 1. Project Overview

## Project Name

Splitwise Clone

## Assignment Goal

Build a simplified Splitwise-inspired application that allows users to manage shared expenses, track balances, record settlements, and communicate within expenses.

The application should be deployable and reproducible using this document.

---

# 2. Product Understanding

Splitwise is an expense-sharing platform that helps groups manage shared expenses and determine who owes whom.

The application allows users to:

* Create groups
* Add members
* Create expenses
* Split expenses
* Track balances
* Record settlements
* View expense history
* Comment on expenses

---

# 3. Product Scope

## In Scope

### Authentication

* Register
* Login
* Logout

### Groups

* Create Group
* View Group
* Add Member
* Remove Member

### Expenses

* Create Expense
* View Expense
* Edit Expense
* Delete Expense

### Split Types

* Equal Split
* Unequal Split
* Percentage Split
* Share Split

### Balances

* Group Balance Summary
* Individual Balance Summary

### Settlements

* Record Settlement
* Settlement History

### Expense Chat

* Real-time comments using Socket.IO

---

## Out Of Scope

* Email notifications
* Push notifications
* Receipt scanning
* Expense categories
* Multi-currency support
* Mobile application

---

# 4. User Workflow

1. User registers.
2. User logs in.
3. User creates group.
4. User adds members.
5. User creates expense.
6. Expense is split.
7. Balances are updated.
8. Users comment on expenses.
9. Users settle debts.
10. Settlement history remains available.

---

# 5. Product Assumptions

* Users can belong to multiple groups.
* Groups can have multiple members.
* A user can participate in multiple expenses.
* Expenses remain visible after settlement.
* Settlements are stored separately from expenses.
* Balances are derived from expenses and settlements.

---

# 6. Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL (Neon)

## ORM

* Prisma

## Authentication

* JWT
* bcryptjs

## Realtime

* Socket.IO

## Deployment

Frontend: Vercel

Backend: Render

Database: Neon PostgreSQL

---

# 7. High Level Architecture

Client (React)

↓

Express API

↓

Prisma ORM

↓

PostgreSQL

Realtime communication:

React Client

↔ Socket.IO ↔ Express Server

---

# 8. Database Schema

## users

id (PK)

name

email (unique)

password

created_at

updated_at

---

## groups

id (PK)

name

created_by (FK users)

created_at

updated_at

---

## group_members

id (PK)

group_id (FK groups)

user_id (FK users)

joined_at

---

## expenses

id (PK)

group_id (FK groups)

description

amount

paid_by (FK users)

split_type

created_at

updated_at

---

## expense_splits

id (PK)

expense_id (FK expenses)

user_id (FK users)

amount

percentage

shares

---

## settlements

id (PK)

group_id (FK groups)

payer_id (FK users)

receiver_id (FK users)

amount

created_at

---

## expense_comments

id (PK)

expense_id (FK expenses)

user_id (FK users)

message

created_at

---

# 9. Balance Calculation Strategy

Balances are not stored directly.

Balances are calculated from:

* Expenses
* Expense Splits
* Settlements

Formula:

Net Balance = Amount Paid - Amount Owed - Settlements

Positive Balance:

User should receive money.

Negative Balance:

User owes money.

---

# 10. API Design (Planned)

## Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

---

## Groups

POST /api/groups

GET /api/groups

GET /api/groups/:id

POST /api/groups/:id/members

DELETE /api/groups/:id/members/:userId

---

## Expenses

POST /api/expenses

GET /api/expenses/:groupId

PUT /api/expenses/:id

DELETE /api/expenses/:id

---

## Settlements

POST /api/settlements

GET /api/settlements/:groupId

---

## Comments

POST /api/comments

GET /api/comments/:expenseId

---

# 11. Frontend Structure

Pages:

* Login Page
* Register Page
* Dashboard Page
* Group Page
* Expense Details Page
* Settlement Page

Components:

* Navbar
* GroupCard
* ExpenseCard
* BalanceSummary
* CommentSection

---

# 12. Deployment Plan

Frontend:

Vercel

Backend:

Render

Database:

Neon PostgreSQL

Environment Variables:

DATABASE_URL

JWT_SECRET

PORT

---

# 13. Testing Plan

Authentication Testing

Group CRUD Testing

Expense CRUD Testing

Split Calculation Testing

Settlement Testing

Realtime Chat Testing

---

# 14. Known Risks

* Incorrect balance calculations
* Split validation errors
* Socket disconnection issues
* Deployment environment variable issues

---

# 15. Trade-offs

Simplifications made:

* No notifications
* No receipt uploads
* No expense categories
* No multi-currency support

Reason:

Focus on core Splitwise functionality within assignment timeline.

---

# 16. AI Collaboration Log

AI Tool Used:

ChatGPT

Purpose:

* Product planning
* Architecture design
* Database schema design
* API design
* Documentation support

This document will be updated whenever architecture, schema, APIs, or workflows change.
