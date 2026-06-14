# SCOPE.md

## Database Schema

The system uses PostgreSQL with Prisma ORM.

Main models:

* User
* Group
* GroupMember
* Expense
* ExpenseSplit
* Settlement
* ExpenseComment
* ImportSession
* ImportReport

## Detected Anomalies

1. Duplicate expenses
2. Missing description
3. Invalid amount
4. Negative amount
5. Unsupported currency
6. USD expense conversion
7. Invalid split type
8. Invalid date
9. Empty row
10. Settlement recorded as expense

## Handling Policy

* Duplicates are flagged for manual review.
* Negative amounts are treated as refunds.
* USD is converted using 1 USD = 83 INR.
* Invalid rows are skipped.
* Settlements are flagged for review.
