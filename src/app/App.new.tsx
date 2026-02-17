import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { BankToaster } from "./components/BankToaster";
import { BankSidebar } from "./components/BankSidebar";
import { BankHeader } from "./components/BankHeader";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { NotificationCenter, Notification } from "./components/NotificationCenter";
import { Dashboard } from "./components/sections/Dashboard";
import { Transfer } from "./components/sections/Transfer";
import { Loans } from "./components/sections/Loans";
import { Invoices } from "./components/sections/Invoices";
import { Cards } from "./components/sections/Cards";
import { Society } from "./components/sections/Society";
import { SharedAccounts } from "./components/sections/SharedAccounts";
import { Savings } from "./components/sections/Savings";
import { BankOpenData, NUIMessage } from "@/types/bank";
import { fetchNUI, getErrorMessage } from "@/utils/nui";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Loader2 } from "lucide-react";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function App() {
  const [visible, setVisible] = useState(import.meta.env.DEV); // true in dev mode
  const [bankData, setBankData] = useState<BankOpenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Persistent state (localStorage)
  const [activeSection, setActiveSection] = useLocalStorage("phantom_bank_section", "dashboard");
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("phantom_bank_notifications", []);
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Add notification helper
  const addNotification = useCallback((
    type: Notification["type"],
    title: string,
    message: string
  ) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  }, [setNotifications]);

  // Mock data for development
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    if (isDev && !bankData) {
      setBankData({
        identifier: "ABC12345",
        playerName: "John Doe",
        iban: "US123456789012",
        balance: 15000,
        cash: 2500,
        creditScore: 750,
        creditScoreLabel: "Good",
        isAtm: false,
        transactions: [
          {
            id: 1,
            sender: "SYSTEM",
            receiver: "ABC12345",
            amount: 1000,
            type: "deposit",
            description: "Paycheck",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            sender: "ABC12345",
            receiver: "ATM",
            amount: 500,
            type: "withdraw",
            description: "Cash withdrawal",
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            sender: "ABC12345",
            receiver: "XYZ98765",
            amount: 250,
            type: "transfer",
            description: "Rent payment",
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        loans: [{
          id: 1,
          amount: 5000,
          interest: 5.5,
          total_to_pay: 5275,
          remaining_balance: 3200,
          due_date: Math.floor((Date.now() + 5184000000) / 1000),
          status: "active",
          created_at: new Date(Date.now() - 2592000000).toISOString(),
          days_remaining: 60,
          next_payment: 275
        }],
        invoices: [{
          id: 1,
          sender: "DEF54321",
          receiver: "ABC12345",
          amount: 150,
          reason: "Services rendered",
          status: "pending",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          expires_at: Math.floor((Date.now() + 604800000) / 1000)
        }],
        cards: [{
          id: 1,
          identifier: "ABC12345",
          card_number_masked: "**** **** **** 1234",
          card_number_last4: "1234",
          card_type: "debit",
          status: "active",
          wrong_pin_count: 0,
          expires_at: Math.floor((Date.now() + 94608000000) / 1000),
          created_at: new Date(Date.now() - 7776000000).toISOString()
        }],
        society: {
          jobName: "police",
          jobLabel: "Los Santos Police Department",
          balance: 50000
        },
        sharedAccounts: [{
          id: 1,
          name: "Family Account",
          balance: 8000,
          role: "owner"
        }],
        savings: {
          balance: 12000,
          last_interest_at: Math.floor((Date.now() - 2592000000) / 1000),
          total_interest_earned: 250,
          accrued_since_last: 25,
          interest_rate: 2.5,
          frequency: "monthly",
          period_seconds: 2592000,
          next_interest_at: Math.floor((Date.now() + 432000000) / 1000)
        },
        businesses: [],
        config: {
          currency: "$",
          maxTransfer: 50000,
          transferTaxPercent: 1,
          enableLoans: true,
          enableInvoices: true,
          enableCards: true,
          enableBusiness: false,
          enableSocietyAccounts: true,
          enableSharedAccounts: true,
          enableSavingsAccounts: true
        }
      });
    }
  }, [bankData]);

  // NUI Message Listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent<NUIMessage>) => {
      const { action, ...data } = event.data;

      switch (action) {
        case "setVisible":
          setVisible(data.visible);
          if (!data.visible) {
            setBankData(null);
          }
          break;

        case "setData":
          if (data.success && data.data) {
            setBankData(data.data);
            setIsLoading(false);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Keyboard Shortcuts (ESC to close, number keys for navigation)
  const handleClose = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchNUI("close", {});
    } catch (error) {
      console.error("Close error:", error);
    }
    setIsLoading(false);
  }, []);

  useKeyboardShortcuts(
    [
      { key: "Escape", callback: handleClose },
      { key: "1", callback: () => setActiveSection("dashboard") },
      { key: "2", callback: () => setActiveSection("transfer") },
      { key: "3", callback: () => setActiveSection("loans") },
      { key: "4", callback: () => setActiveSection("invoices") },
      { key: "5", callback: () => setActiveSection("cards") },
    ],
    visible && !!bankData
  );

  // Handler functions with confirm dialogs where needed
  const showConfirmDialog = (
    title: string,
    description: string,
    onConfirm: () => void,
    variant: "danger" | "warning" | "info" = "warning"
  ) => {
    setConfirmDialog({ isOpen: true, title, description, onConfirm, variant });
  };

  const handleDeposit = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("deposit", { amount });
      if (response.success) {
        toast.success(`Deposited ${bankData?.config.currency}${amount}`);
        addNotification("success", "Deposit Successful", `Deposited ${bankData?.config.currency}${amount} to your account`);
      } else {
        toast.error(getErrorMessage(response.message || "error"));
        addNotification("error", "Deposit Failed", getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to deposit");
      addNotification("error", "Deposit Failed", "An unexpected error occurred");
    }
    setIsLoading(false);
  };

  const handleWithdraw = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("withdraw", { amount });
      if (response.success) {
        toast.success(`Withdrew ${bankData?.config.currency}${amount}`);
        addNotification("success", "Withdrawal Successful", `Withdrew ${bankData?.config.currency}${amount} from your account`);
      } else {
        toast.error(getErrorMessage(response.message || "error"));
        addNotification("error", "Withdrawal Failed", getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to withdraw");
    }
    setIsLoading(false);
  };

  const handleTransfer = async (targetIdentifier: string, amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("transfer", { targetIdentifier, amount });
      if (response.success) {
        toast.success(`Transferred ${bankData?.config.currency}${amount}`);
        addNotification("success", "Transfer Successful", `Transferred ${bankData?.config.currency}${amount} to ${targetIdentifier}`);
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to transfer");
    }
    setIsLoading(false);
  };

  const handleRequestLoan = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("requestLoan", { amount });
      if (response.success) {
        toast.success("Loan request submitted");
        addNotification("info", "Loan Requested", `Loan request for ${bankData?.config.currency}${amount} submitted`);
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to request loan");
    }
    setIsLoading(false);
  };

  const handlePayLoan = async (loanId: number, amount?: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("payLoan", { loanId, amount });
      if (response.success) {
        toast.success("Loan payment successful");
        addNotification("success", "Loan Payment", "Successfully paid loan installment");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to pay loan");
    }
    setIsLoading(false);
  };

  const handleCancelLoan = async (loanId: number) => {
    showConfirmDialog(
      "Cancel Loan?",
      "Are you sure you want to cancel this loan? This may include a cancellation fee and affect your credit score.",
      async () => {
        setIsLoading(true);
        try {
          const response = await fetchNUI("cancelLoan", { loanId });
          if (response.success) {
            toast.success("Loan cancelled");
            addNotification("warning", "Loan Cancelled", "Your loan has been cancelled");
          } else {
            toast.error(getErrorMessage(response.message || "error"));
          }
        } catch (error) {
          toast.error("Failed to cancel loan");
        }
        setIsLoading(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      "danger"
    );
  };

  // Continue with other handlers...
  // (I'll add the rest in the next parts due to size)

  const handlePayInvoice = async (invoiceId: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("payInvoice", { invoiceId });
      if (response.success) {
        toast.success("Invoice paid");
        addNotification("success", "Invoice Paid", "Successfully paid invoice");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to pay invoice");
    }
    setIsLoading(false);
  };

  const handleDeclineInvoice = async (invoiceId: number) => {
    showConfirmDialog(
      "Decline Invoice?",
      "Are you sure you want to decline this invoice?",
      async () => {
        setIsLoading(true);
        try {
          const response = await fetchNUI("declineInvoice", { invoiceId });
          if (response.success) {
            toast.success("Invoice declined");
          } else {
            toast.error(getErrorMessage(response.message || "error"));
          }
        } catch (error) {
          toast.error("Failed to decline invoice");
        }
        setIsLoading(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      "warning"
    );
  };

  const handleCreateCard = async (pin: string, cardType: string) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("createCard", { pin, cardType });
      if (response.success) {
        toast.success("Card created");
        addNotification("success", "New Card", "Your card has been created successfully");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to create card");
    }
    setIsLoading(false);
  };

  const handleChangeCardPin = async (cardId: number, oldPin: string, newPin: string) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("changeCardPin", { cardId, oldPin, newPin });
      if (response.success) {
        toast.success("PIN changed successfully");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to change PIN");
    }
    setIsLoading(false);
  };

  const handleSetCardStatus = async (cardId: number, status: "active" | "blocked") => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("setCardStatus", { cardId, status });
      if (response.success) {
        toast.success(`Card ${status}`);
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to update card status");
    }
    setIsLoading(false);
  };

  // Society handlers
  const handleDepositSociety = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("depositSociety", { amount });
      if (response.success) {
        toast.success("Society deposit successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to deposit to society");
    }
    setIsLoading(false);
  };

  const handleWithdrawSociety = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("withdrawSociety", { amount });
      if (response.success) {
        toast.success("Society withdrawal successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to withdraw from society");
    }
    setIsLoading(false);
  };

  const handleTransferToSociety = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("transferToSociety", { amount });
      if (response.success) {
        toast.success("Transfer to society successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to transfer to society");
    }
    setIsLoading(false);
  };

  const handleTransferFromSociety = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("transferFromSociety", { amount });
      if (response.success) {
        toast.success("Transfer from society successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to transfer from society");
    }
    setIsLoading(false);
  };

  // Shared account handlers
  const handleCreateSharedAccount = async (accountName: string) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("createSharedAccount", { accountName });
      if (response.success) {
        toast.success("Shared account created");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to create shared account");
    }
    setIsLoading(false);
  };

  const handleDepositShared = async (accountId: number, amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("depositShared", { accountId, amount });
      if (response.success) {
        toast.success("Deposit successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to deposit");
    }
    setIsLoading(false);
  };

  const handleWithdrawShared = async (accountId: number, amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("withdrawShared", { accountId, amount });
      if (response.success) {
        toast.success("Withdrawal successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to withdraw");
    }
    setIsLoading(false);
  };

  const handleAddSharedMember = async (accountId: number, targetIdentifier: string) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("addSharedMember", { accountId, targetIdentifier });
      if (response.success) {
        toast.success("Member added");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to add member");
    }
    setIsLoading(false);
  };

  const handleRemoveSharedMember = async (accountId: number, targetIdentifier: string) => {
    showConfirmDialog(
      "Remove Member?",
      "Are you sure you want to remove this member from the shared account?",
      async () => {
        setIsLoading(true);
        try {
          const response = await fetchNUI("removeSharedMember", { accountId, targetIdentifier });
          if (response.success) {
            toast.success("Member removed");
          } else {
            toast.error(getErrorMessage(response.message || "error"));
          }
        } catch (error) {
          toast.error("Failed to remove member");
        }
        setIsLoading(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      "warning"
    );
  };

  // Savings handlers
  const handleDepositSavings = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("depositSavings", { amount });
      if (response.success) {
        toast.success("Savings deposit successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to deposit to savings");
    }
    setIsLoading(false);
  };

  const handleWithdrawSavings = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("withdrawSavings", { amount });
      if (response.success) {
        toast.success("Savings withdrawal successful");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to withdraw from savings");
    }
    setIsLoading(false);
  };

  const handleSendInvoice = async (receiverIdentifier: string, amount: number, reason?: string) => {
    setIsLoading(true);
    try {
      const response = await fetchNUI("sendInvoice", { receiverIdentifier, amount, reason });
      if (response.success) {
        toast.success("Invoice sent");
      } else {
        toast.error(getErrorMessage(response.message || "error"));
      }
    } catch (error) {
      toast.error("Failed to send invoice");
    }
    setIsLoading(false);
  };

  // Render section based on active selection
  const renderSection = () => {
    if (!bankData) return null;

    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            balance={bankData.balance}
            cash={bankData.cash}
            transactions={bankData.transactions}
            currency={bankData.config.currency}
            creditScore={bankData.creditScore}
            creditScoreLabel={bankData.creditScoreLabel}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            isLoading={isLoading}
          />
        );

      case "transfer":
        return (
          <Transfer
            balance={bankData.balance}
            currency={bankData.config.currency}
            transferTaxPercent={bankData.config.transferTaxPercent}
            maxTransfer={bankData.config.maxTransfer}
            onTransfer={handleTransfer}
            isLoading={isLoading}
          />
        );

      case "loans":
        return (
          <Loans
            loans={bankData.loans}
            currency={bankData.config.currency}
            creditScore={bankData.creditScore}
            onRequestLoan={handleRequestLoan}
            onPayLoan={handlePayLoan}
            onCancelLoan={handleCancelLoan}
            isLoading={isLoading}
          />
        );

      case "invoices":
        return (
          <Invoices
            invoices={bankData.invoices}
            currency={bankData.config.currency}
            playerIdentifier={bankData.identifier}
            onPayInvoice={handlePayInvoice}
            onDeclineInvoice={handleDeclineInvoice}
            isLoading={isLoading}
          />
        );

      case "cards":
        return (
          <Cards
            cards={bankData.cards}
            onCreateCard={handleCreateCard}
            onChangePin={handleChangeCardPin}
            onSetCardStatus={handleSetCardStatus}
            isLoading={isLoading}
          />
        );

      case "society":
        return bankData.society ? (
          <Society
            society={bankData.society}
            cash={bankData.cash}
            balance={bankData.balance}
            currency={bankData.config.currency}
            onDepositSociety={handleDepositSociety}
            onWithdrawSociety={handleWithdrawSociety}
            onTransferToSociety={handleTransferToSociety}
            onTransferFromSociety={handleTransferFromSociety}
            isLoading={isLoading}
          />
        ) : null;

      case "shared":
        return (
          <SharedAccounts
            sharedAccounts={bankData.sharedAccounts}
            cash={bankData.cash}
            currency={bankData.config.currency}
            onCreateAccount={handleCreateSharedAccount}
            onDepositShared={handleDepositShared}
            onWithdrawShared={handleWithdrawShared}
            onAddMember={handleAddSharedMember}
            onRemoveMember={handleRemoveSharedMember}
            isLoading={isLoading}
          />
        );

      case "savings":
        return bankData.savings ? (
          <Savings
            savings={bankData.savings}
            balance={bankData.balance}
            currency={bankData.config.currency}
            onDepositSavings={handleDepositSavings}
            onWithdrawSavings={handleWithdrawSavings}
            isLoading={isLoading}
          />
        ) : null;

      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <>
      <BankToaster />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        isLoading={isLoading}
      />

      {/* Main UI with slide-in animation */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a0a14] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-7xl h-[90vh] flex rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 gpu-accelerate"
            >
              {!bankData ? (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0f0f1e]/95 to-[#1a1a2e]/95">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading bank data...</p>
                  </div>
                </div>
              ) : (
                <>
                  <BankSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    config={bankData.config}
                    society={bankData.society}
                    sharedAccounts={bankData.sharedAccounts}
                    savings={bankData.savings}
                    isAtm={bankData.isAtm}
                    onLogout={handleClose}
                  />

                  <div className="flex-1 flex flex-col bg-[#1a1a2e]">
                    <BankHeader
                      playerName={bankData.playerName}
                      iban={bankData.iban}
                      balance={bankData.balance}
                      cash={bankData.cash}
                      currency={bankData.config.currency}
                      onClose={handleClose}
                      notificationCenter={
                        <NotificationCenter
                          notifications={notifications}
                          onMarkAsRead={(id) => {
                            setNotifications(notifications.map(n => 
                              n.id === id ? { ...n, read: true } : n
                            ));
                          }}
                          onMarkAllAsRead={() => {
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                          onClear={(id) => {
                            setNotifications(notifications.filter(n => n.id !== id));
                          }}
                        />
                      }
                    />

                    <div className="flex-1 overflow-y-auto p-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSection}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          {renderSection()}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}