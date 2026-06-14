# DECISIONS.md

## Decision 1: Use PostgreSQL

Options considered:

* MongoDB
* PostgreSQL

Chosen:

* PostgreSQL

Reason:
The assignment explicitly required a relational database.

---

## Decision 2: Duplicate Handling

Options:

* Delete duplicates automatically
* Flag duplicates

Chosen:

* Flag duplicates

Reason:
Users should approve changes instead of silent deletion.

---

## Decision 3: USD Conversion

Chosen rate:
1 USD = 83 INR

Reason:
A fixed rate provides deterministic calculations.

---

## Decision 4: Membership History

Added:

* joinedAt
* leftAt

Reason:
Members can join or leave groups over time.
