const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const xml2js = require("xml2js");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3008;

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Update with your MySQL user
  password: "root", // Update with your MySQL password
  database: "credit_report"
});

db.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Middleware
app.use(bodyParser.json());
const upload = multer({ dest: "uploads/" });

// XML Upload Endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file || req.file.mimetype !== "application/xml") {
    return res.status(400).json({ error: "Invalid file format. Please upload an XML file." });
  }

  const parser = new xml2js.Parser();
  const xmlFile = req.file.path;

  fs.readFile(xmlFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading XML file." });
    }

    parser.parseString(data, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing XML data." });
      }

      // Extract data from the parsed XML
      const reportData = result.report; // Adjust according to XML structure

      // Insert Basic Details into `basic_details` table
      const basicDetails = {
        name: reportData.name[0],
        mobile_phone: reportData.mobile_phone[0],
        email: reportData.email[0],  // New field for email
        pan: reportData.pan[0],
        date_of_birth: reportData.date_of_birth[0],  // New field for date of birth
        gender: reportData.gender[0], // New field for gender
        address: reportData.address[0], // New field for address
      };

      db.query("INSERT INTO basic_details SET ?", basicDetails, (err, basicDetailsResult) => {
        if (err) {
          return res.status(500).json({ error: "Error inserting basic details into MySQL." });
        }

        const basicDetailId = basicDetailsResult.insertId;

        // Insert Report Data into `reports` table
        const report = {
          basic_detail_id: basicDetailId, // Link to `basic_details`
          credit_score: parseInt(reportData.credit_score[0]),
          total_accounts: parseInt(reportData.total_accounts[0]),
          active_accounts: parseInt(reportData.active_accounts[0]),
          closed_accounts: parseInt(reportData.closed_accounts[0]),
          current_balance_amount: parseFloat(reportData.current_balance_amount[0]),
          secured_accounts_amount: parseFloat(reportData.secured_accounts_amount[0]),
          unsecured_accounts_amount: parseFloat(reportData.unsecured_accounts_amount[0]),
          last_7_days_credit_enquiries: parseInt(reportData.last_7_days_credit_enquiries[0])
        };

        db.query("INSERT INTO reports SET ?", report, (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Error inserting data into MySQL." });
          }

          const reportId = result.insertId;

          // Insert associated credit account data
          const creditAccounts = reportData.credit_accounts[0].credit_account.map(account => {
            return [
              reportId,
              account.credit_card_name[0],
              account.bank_name[0],
              account.address[0],
              account.account_number[0],
              parseFloat(account.amount_overdue[0]),
              parseFloat(account.current_balance[0])
            ];
          });

          const insertQuery = "INSERT INTO credit_accounts (report_id, credit_card_name, bank_name, address, account_number, amount_overdue, current_balance) VALUES ?";
          db.query(insertQuery, [creditAccounts], (err) => {
            if (err) {
              return res.status(500).json({ error: "Error inserting credit account data into MySQL." });
            }

            res.status(200).json({ message: "XML processed and data stored successfully." });
          });
        });
      });
    });
  });
});

// Retrieve Report Data
app.get("/report/:id", (req, res) => {
  const reportId = req.params.id;

  // Retrieve basic details
  db.query("SELECT * FROM basic_details WHERE id = ?", [reportId], (err, basicDetailsResults) => {
    if (err || !basicDetailsResults.length) {
      return res.status(500).json({ error: "Error retrieving basic details." });
    }

    const basicDetails = basicDetailsResults[0];

    // Retrieve report data
    db.query("SELECT * FROM reports WHERE basic_detail_id = ?", [reportId], (err, reportResults) => {
      if (err || !reportResults.length) {
        return res.status(500).json({ error: "Error retrieving report data." });
      }

      const report = reportResults[0];

      // Retrieve associated credit accounts
      db.query("SELECT * FROM credit_accounts WHERE report_id = ?", [report.id], (err, accountResults) => {
        if (err) {
          return res.status(500).json({ error: "Error retrieving credit accounts." });
        }

        res.status(200).json({ basicDetails, report, accounts: accountResults });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
