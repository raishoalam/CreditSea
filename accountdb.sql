CREATE DATABASE credit_report;

USE credit_report;

-- Table to store basic personal details
CREATE TABLE basic_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  mobile_phone VARCHAR(50),
  email VARCHAR(255),
  pan VARCHAR(50),
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  address VARCHAR(255)
);

-- Table to store report summary and credit scores (now linking to basic_details via `basic_detail_id`)
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  basic_detail_id INT,
  credit_score INT,
  total_accounts INT,
  active_accounts INT,
  closed_accounts INT,
  current_balance_amount DECIMAL(10,2),
  secured_accounts_amount DECIMAL(10,2),
  unsecured_accounts_amount DECIMAL(10,2),
  last_7_days_credit_enquiries INT,
  FOREIGN KEY (basic_detail_id) REFERENCES basic_details(id)
);

-- Table to store credit account information (remains the same)
CREATE TABLE credit_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT,
  credit_card_name VARCHAR(255),
  bank_name VARCHAR(255),
  address VARCHAR(255),
  account_number VARCHAR(255),
  amount_overdue DECIMAL(10,2),
  current_balance DECIMAL(10,2),
  FOREIGN KEY (report_id) REFERENCES reports(id)
);
