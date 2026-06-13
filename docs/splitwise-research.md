# Splitwise Research Notes

## Product Overview

Splitwise is an expense-sharing application used by groups to track shared expenses and settle debts.

## Core Workflow

1. User creates an account.
2. User creates a group.
3. Members are added to the group.
4. Expenses are added.
5. Expenses are split among participants.
6. Balances are calculated automatically.
7. Users settle debts.
8. Settlement history is preserved.

## Expense Split Types

### Equal Split

Expense is divided equally among participants.

### Unequal Split

Users manually specify exact amounts.

### Percentage Split

Users specify percentages that total 100%.

### Share Split

Users specify shares. Expense is divided proportionally.

## Settlements

Settlements are recorded separately from expenses.

Expenses are not deleted after settlement.

## Balance Calculation

Balances are derived from expenses and settlements.

The system calculates who owes whom based on historical transactions.

## Product Assumptions

* Users can belong to multiple groups.
* Groups can contain multiple members.
* A single expense can involve multiple participants.
* Settlement history should remain available.
