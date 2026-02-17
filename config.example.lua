-- =====================================================
-- PHANTOM BANK - CONFIGURATION EXAMPLE
-- =====================================================
-- Copy this file to config.lua and adjust settings
-- =====================================================

Config = {}

-- =====================================================
-- GENERAL SETTINGS
-- =====================================================
Config.Framework = 'esx'  -- 'esx', 'qbcore', or 'custom'
Config.Currency = '$'     -- Currency symbol
Config.Locale = 'en'      -- 'en', 'pt', 'es', etc.

-- =====================================================
-- ACCOUNT SETTINGS
-- =====================================================
Config.StartingBalance = 5000       -- Starting bank balance for new players
Config.StartingCash = 1000          -- Starting cash for new players
Config.StartingCreditScore = 600    -- Starting credit score (300-850)

-- =====================================================
-- TRANSACTION SETTINGS
-- =====================================================
Config.MaxTransferAmount = 50000    -- Maximum transfer amount
Config.TransferTaxPercent = 1       -- Tax percentage on transfers (0 = disabled)
Config.MinTransferAmount = 1        -- Minimum transfer amount

-- =====================================================
-- ATM SETTINGS
-- =====================================================
Config.EnableATM = true
Config.ATMLocations = {
    -- Add your ATM coordinates here
    {x = 147.4, y = -1035.8, z = 29.3},
    {x = -1827.04, y = 785.55, z = 138.19},
    -- Add more...
}

-- ATM limitations
Config.ATMMaxWithdraw = 5000        -- Max withdraw at ATM
Config.ATMMaxDeposit = 10000        -- Max deposit at ATM
Config.ATMDisabledFeatures = {      -- Features disabled at ATM
    'loans',
    'cards',
    'shared_accounts',
    'society'
}

-- =====================================================
-- LOAN SETTINGS
-- =====================================================
Config.EnableLoans = true

Config.Loans = {
    MinAmount = 1000,               -- Minimum loan amount
    MaxAmount = 100000,             -- Maximum loan amount
    BaseInterestRate = 5.0,         -- Base interest rate (%)
    
    -- Credit score affects interest rate
    InterestByScore = {
        {score = 800, rate = 3.0},  -- Excellent: 3%
        {score = 740, rate = 4.0},  -- Very Good: 4%
        {score = 670, rate = 5.0},  -- Good: 5%
        {score = 580, rate = 7.0},  -- Fair: 7%
        {score = 0,   rate = 10.0}  -- Poor: 10%
    },
    
    -- Loan duration in days
    MinDuration = 7,                -- Minimum 7 days
    MaxDuration = 180,              -- Maximum 180 days
    DefaultDuration = 30,           -- Default 30 days
    
    -- Penalties
    LateFeePercent = 2.0,           -- 2% late fee per day
    MaxLateFee = 50.0,              -- Max 50% late fee
    
    -- Credit score impact
    OnTimePaymentBonus = 10,        -- +10 points for on-time payment
    LatePaymentPenalty = -20,       -- -20 points for late payment
    DefaultPenalty = -50            -- -50 points for default
}

-- =====================================================
-- CARD SETTINGS
-- =====================================================
Config.EnableCards = true

Config.Cards = {
    MaxCardsPerPlayer = 3,          -- Maximum cards per player
    CardCost = 500,                 -- Cost to create a card
    
    -- Card types and their requirements
    Types = {
        debit = {
            label = 'Debit Card',
            minCreditScore = 0,
            cost = 500
        },
        gold = {
            label = 'Gold Card',
            minCreditScore = 700,
            cost = 2000
        },
        express = {
            label = 'Express Card',
            minCreditScore = 800,
            cost = 5000
        }
    },
    
    -- PIN settings
    PINLength = 4,
    MaxWrongPIN = 3,                -- Block card after 3 wrong attempts
    
    -- Card duration
    ExpiryYears = 3,                -- Cards expire after 3 years
    
    -- Fees
    MonthlyFee = {
        debit = 0,
        gold = 100,
        express = 250
    }
}

-- =====================================================
-- INVOICE SETTINGS
-- =====================================================
Config.EnableInvoices = true

Config.Invoices = {
    MaxAmount = 50000,              -- Maximum invoice amount
    MinAmount = 1,                  -- Minimum invoice amount
    DefaultExpiry = 7,              -- Default expiry in days
    MaxExpiry = 30,                 -- Maximum expiry in days
    
    -- Fees
    SendFee = 50,                   -- Fee to send invoice
    SendFeePercent = 0,             -- Additional % fee (0 = disabled)
    
    -- Limits
    MaxInvoicesPerDay = 10,         -- Max invoices per player per day
}

-- =====================================================
-- SOCIETY ACCOUNT SETTINGS
-- =====================================================
Config.EnableSocietyAccounts = true

Config.Society = {
    -- Jobs that have society accounts
    AllowedJobs = {
        'police',
        'ambulance',
        'mechanic',
        'cardealer',
        -- Add more jobs...
    },
    
    -- Permissions by job grade
    MinGradeDeposit = 0,            -- Minimum grade to deposit
    MinGradeWithdraw = 3,           -- Minimum grade to withdraw
    MinGradeTransfer = 4,           -- Minimum grade to transfer
    
    -- Limits
    MaxWithdrawPerDay = 50000,      -- Max withdraw per player per day
}

-- =====================================================
-- SHARED ACCOUNT SETTINGS
-- =====================================================
Config.EnableSharedAccounts = true

Config.SharedAccounts = {
    MaxAccountsPerPlayer = 5,       -- Max shared accounts per player
    MaxMembersPerAccount = 10,      -- Max members per shared account
    CreationCost = 1000,            -- Cost to create shared account
    
    -- Permissions
    OwnerCanRemoveOwner = false,    -- Can owner remove other owners
    MemberCanDeposit = true,        -- Can members deposit
    MemberCanWithdraw = true,       -- Can members withdraw
    MemberCanAddMembers = false,    -- Can members add other members
}

-- =====================================================
-- SAVINGS ACCOUNT SETTINGS
-- =====================================================
Config.EnableSavingsAccounts = true

Config.Savings = {
    MinBalance = 0,                 -- Minimum balance to earn interest
    MinDeposit = 100,               -- Minimum deposit amount
    
    -- Interest settings
    InterestRate = 2.5,             -- Annual interest rate (%)
    InterestFrequency = 'monthly',  -- 'daily', 'weekly', 'monthly'
    
    -- Withdrawal settings
    WithdrawalFeePercent = 1.0,     -- Fee for early withdrawal (%)
    MinWithdrawal = 100,            -- Minimum withdrawal amount
    
    -- Penalties
    EarlyWithdrawalPenalty = true,  -- Apply penalty for withdrawals
}

-- =====================================================
-- CREDIT SCORE SETTINGS
-- =====================================================
Config.CreditScore = {
    Min = 300,
    Max = 850,
    
    -- Score brackets
    Labels = {
        {min = 800, max = 850, label = 'Excellent'},
        {min = 740, max = 799, label = 'Very Good'},
        {min = 670, max = 739, label = 'Good'},
        {min = 580, max = 669, label = 'Fair'},
        {min = 300, max = 579, label = 'Poor'}
    },
    
    -- Score changes
    OnDepositBonus = 1,             -- +1 per $10k deposited
    OnWithdrawPenalty = 0,          -- No penalty for withdrawals
    OnTransferBonus = 0,            -- No bonus for transfers
    
    -- Monthly adjustments
    MonthlyDecay = 5,               -- -5 points per month of inactivity
    MonthlyGrowth = 5,              -- +5 points per month of activity
}

-- =====================================================
-- NOTIFICATION SETTINGS
-- =====================================================
Config.Notifications = {
    Type = 'default',               -- 'default', 'mythic', 'ox', 'esx'
    Position = 'top-right',         -- Toast notification position
    Duration = 5000,                -- Notification duration (ms)
}

-- =====================================================
-- LOGGING SETTINGS
-- =====================================================
Config.Logging = {
    Enabled = true,
    LogTransactions = true,
    LogLoans = true,
    LogCards = true,
    LogSociety = true,
    LogShared = true,
    
    -- Discord webhook (optional)
    DiscordWebhook = '',
    DiscordColor = 5814783,         -- Purple
}

-- =====================================================
-- SECURITY SETTINGS
-- =====================================================
Config.Security = {
    -- Anti-spam
    CooldownBetweenTransactions = 1000,  -- 1 second cooldown
    
    -- Anti-exploit
    MaxTransactionsPerMinute = 20,
    MaxAccountCreationsPerHour = 5,
    
    -- Validation
    ValidatePlayerDistance = true,       -- Check distance for ATM/bank
    MaxDistance = 3.0,                   -- Max distance in meters
}

-- =====================================================
-- DEBUG SETTINGS
-- =====================================================
Config.Debug = false                -- Enable debug prints
Config.TestMode = false             -- Enable test mode (mock data)

return Config
