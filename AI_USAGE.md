# AI_USAGE.md

## AI Tools Used

* ChatGPT
* GitHub Copilot

## How AI Was Used

AI was used for:

* Generating boilerplate code
* Designing Prisma schema
* Creating frontend components
* Implementing CSV import functionality

## Cases Where AI Was Wrong

### Case 1

Issue:
Generated incorrect Prisma relations.

Fix:
Relations were manually corrected and tested.

### Case 2

Issue:
Frontend API URL always pointed to localhost.

Fix:
Replaced with environment variables.

### Case 3

Issue:
CSV anomaly detection missed duplicate expenses.

Fix:
Implemented custom duplicate detection using Set.
