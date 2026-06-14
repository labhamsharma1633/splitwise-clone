import fs from "fs";
import csv from "csv-parser";
import prisma from "../config/prisma.js";

export const importCSV = async (req, res) => {
try {
if (!req.file) {
return res.status(400).json({
success: false,
message: "CSV file is required",
});
}


const results = [];

fs.createReadStream(req.file.path)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    try {
      const session = await prisma.importSession.create({
        data: {
          fileName: req.file.originalname,
        },
      });

      const reports = [];

      results.forEach((row, index) => {
        // Empty row
        if (Object.values(row).every((value) => !value)) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Empty row",
            action: "Skipped row",
            severity: "LOW",
          });

          return;
        }

        // Invalid amount
        if (!row.amount || isNaN(Number(row.amount))) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Invalid amount",
            action: "Skipped row",
            severity: "HIGH",
          });
        }

        // Missing description
        if (!row.description) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Missing description",
            action: "Skipped row",
            severity: "HIGH",
          });
        }

        // Negative amount
        if (Number(row.amount) < 0) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Negative amount",
            action: "Marked as refund",
            severity: "MEDIUM",
          });
        }

        // Currency validation
        const allowedCurrencies = ["INR", "USD"];

        if (
          row.currency &&
          !allowedCurrencies.includes(
            row.currency.toUpperCase()
          )
        ) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Unsupported currency",
            action: "Skipped row",
            severity: "HIGH",
          });
        }

        // USD conversion
        if (
          row.currency?.toUpperCase() === "USD"
        ) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "USD expense",
            action:
              "Converted using 1 USD = 83 INR",
            severity: "LOW",
          });
        }

        // Split type validation
        const validSplitTypes = [
          "EQUAL",
          "UNEQUAL",
          "PERCENTAGE",
          "SHARE",
        ];

        if (
          row.split_type &&
          !validSplitTypes.includes(
            row.split_type.toUpperCase()
          )
        ) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Invalid split type",
            action: "Skipped row",
            severity: "HIGH",
          });
        }

        // Date validation
        if (
          row.date &&
          isNaN(new Date(row.date).getTime())
        ) {
          reports.push({
            sessionId: session.id,
            rowNumber: index + 1,
            issue: "Invalid date",
            action: "Skipped row",
            severity: "HIGH",
          });
        }
      });

      if (reports.length > 0) {
        await prisma.importReport.createMany({
          data: reports,
        });
      }

      // Delete uploaded file after processing
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        importedRows: results.length,
        anomalies: reports.length,
        reports,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });


} catch (error) {
console.error(error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};
