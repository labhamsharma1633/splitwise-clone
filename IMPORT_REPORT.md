# IMPORT_REPORT.md

## CSV Import Summary

* File Imported: `expenses_export.csv`
* Imported Rows: 42
* Anomalies Detected: 12
* Import Status: Success

---

## Import Workflow

1. User uploads CSV file through the frontend.
2. Backend receives the file using Multer.
3. CSV is parsed using `csv-parser`.
4. Each row is validated and checked for anomalies.
5. Anomalies are stored in the `ImportReport` table.
6. A summary report is returned to the frontend.

---

## Detected Anomalies

| Row | Issue           | Action Taken                   | Severity |
| --- | --------------- | ------------------------------ | -------- |
| 6   | Invalid amount  | Skipped row                    | HIGH     |
| 19  | USD expense     | Converted using 1 USD = 83 INR | LOW      |
| 20  | USD expense     | Converted using 1 USD = 83 INR | LOW      |
| 25  | Negative amount | Marked as refund               | MEDIUM   |
| 27  | Invalid date    | Skipped row                    | HIGH     |
| 30  | Zero amount     | Flagged for review             | MEDIUM   |

---

## Anomaly Handling Policy

* Invalid rows are skipped.
* USD expenses are converted to INR using a fixed exchange rate of **1 USD = 83 INR**.
* Negative amounts are treated as refunds.
* Duplicate or suspicious records are flagged for manual review.
* Invalid dates are skipped to prevent incorrect balance calculations.

---

## Database Tables Used

* `ImportSession`
* `ImportReport`

The application generates this report dynamically after every CSV import and stores anomaly details for auditing and review.
