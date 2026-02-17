-- =====================================================
-- PHANTOM BANK - DATABASE STRUCTURE EXAMPLE
-- =====================================================
-- This is an EXAMPLE structure. Adjust to your framework!
-- Compatible with: ESX, QBCore, or custom frameworks
-- =====================================================

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `type` enum('deposit','withdraw','transfer') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  KEY `receiver` (`receiver`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- LOANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_loans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `interest` decimal(5,2) NOT NULL DEFAULT 5.00,
  `total_to_pay` int(11) NOT NULL,
  `remaining_balance` int(11) NOT NULL,
  `due_date` int(11) NOT NULL,
  `status` enum('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `identifier` (`identifier`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INVOICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` int(11) NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  KEY `receiver` (`receiver`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(50) NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `card_number_masked` varchar(19) NOT NULL,
  `card_number_last4` varchar(4) NOT NULL,
  `card_type` enum('debit','gold','express') NOT NULL DEFAULT 'debit',
  `pin` varchar(255) NOT NULL,
  `status` enum('active','blocked') NOT NULL DEFAULT 'active',
  `wrong_pin_count` int(11) NOT NULL DEFAULT 0,
  `expires_at` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `card_number` (`card_number`),
  KEY `identifier` (`identifier`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SHARED ACCOUNTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_shared_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `owner` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SHARED ACCOUNT MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_shared_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `identifier` varchar(50) NOT NULL,
  `role` enum('owner','member') NOT NULL DEFAULT 'member',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  KEY `identifier` (`identifier`),
  CONSTRAINT `fk_shared_account` FOREIGN KEY (`account_id`) REFERENCES `bank_shared_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAVINGS ACCOUNTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_savings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(50) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `last_interest_at` int(11) NOT NULL,
  `total_interest_earned` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CREDIT SCORE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `bank_credit_score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(50) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 600,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
-- Add additional indexes as needed based on your queries

-- Transaction history queries
CREATE INDEX idx_transactions_lookup ON bank_transactions(sender, receiver, created_at);

-- Active loans
CREATE INDEX idx_active_loans ON bank_loans(identifier, status, due_date);

-- Pending invoices
CREATE INDEX idx_pending_invoices ON bank_invoices(receiver, status, expires_at);

-- Card lookups
CREATE INDEX idx_card_lookup ON bank_cards(identifier, status);

-- =====================================================
-- EXAMPLE TRIGGERS (Optional)
-- =====================================================

-- Auto-update credit score after loan payment
DELIMITER $$
CREATE TRIGGER update_credit_on_loan_payment
AFTER UPDATE ON bank_loans
FOR EACH ROW
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE bank_credit_score 
    SET score = LEAST(score + 10, 850) 
    WHERE identifier = NEW.identifier;
  END IF;
END$$
DELIMITER ;

-- =====================================================
-- SAMPLE DATA (Development Only)
-- =====================================================
-- Uncomment for testing purposes only!

/*
-- Sample transaction
INSERT INTO `bank_transactions` (`sender`, `receiver`, `amount`, `type`, `description`) 
VALUES ('SYSTEM', 'ABC12345', 1000, 'deposit', 'Initial deposit');

-- Sample loan
INSERT INTO `bank_loans` (`identifier`, `amount`, `interest`, `total_to_pay`, `remaining_balance`, `due_date`, `status`) 
VALUES ('ABC12345', 5000, 5.50, 5275, 5275, UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 60 DAY)), 'active');

-- Sample credit score
INSERT INTO `bank_credit_score` (`identifier`, `score`) 
VALUES ('ABC12345', 750);
*/

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Adjust field types to match your framework
-- 2. ESX uses 'identifier', QBCore uses 'citizenid'
-- 3. Money values: INT for cents or DECIMAL for dollars
-- 4. Always backup before running in production!
-- 5. Test thoroughly in development environment first
-- =====================================================
