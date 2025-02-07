
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreditReport = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [creditAccounts, setCreditAccounts] = useState([]);

  useEffect(() => {
    const fetchCreditReport = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/report/${reportId}`);
        setReport(response.data.report);
        setCreditAccounts(response.data.accounts);
      } catch (error) {
        console.error("Error fetching credit report:", error);
      }
    };

    if (reportId) fetchCreditReport();
  }, [reportId]);

  if (!report) return <p>Loading...</p>;

  return (
    <div>
      <h3>Credit Report</h3>
      <p><strong>Credit Score:</strong> {report.credit_score}</p>
      <p><strong>Total Accounts:</strong> {report.total_accounts}</p>
      <p><strong>Active Accounts:</strong> {report.active_accounts}</p>
      <p><strong>Closed Accounts:</strong> {report.closed_accounts}</p>
      <p><strong>Current Balance Amount:</strong> {report.current_balance_amount}</p>
      <p><strong>Secured Accounts Amount:</strong> {report.secured_accounts_amount}</p>
      <p><strong>Unsecured Accounts Amount:</strong> {report.unsecured_accounts_amount}</p>
      <p><strong>Last 7 Days Credit Enquiries:</strong> {report.last_7_days_credit_enquiries}</p>

      <h4>Credit Accounts</h4>
      <table border="1">
        <thead>
          <tr>
            <th>Credit Card</th>
            <th>Bank</th>
            <th>Address</th>
            <th>Account Number</th>
            <th>Amount Overdue</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {creditAccounts.map((account) => (
            <tr key={account.id}>
              <td>{account.credit_card_name}</td>
              <td>{account.bank_name}</td>
              <td>{account.address}</td>
              <td>{account.account_number}</td>
              <td>{account.amount_overdue}</td>
              <td>{account.current_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditReport;
