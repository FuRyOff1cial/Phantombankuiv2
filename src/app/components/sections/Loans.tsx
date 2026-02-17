import { useState } from "react";
import { motion } from "motion/react";
import { Landmark, Plus, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loan } from "@/types/bank";
import { formatCurrency, formatDate, formatTimeUntil } from "@/utils/nui";
import { toast } from "sonner";

interface LoansProps {
  loans: Loan[];
  currency: string;
  creditScore: number;
  onRequestLoan: (amount: number) => void;
  onPayLoan: (loanId: number, amount?: number) => void;
  onCancelLoan: (loanId: number) => void;
  isLoading: boolean;
}

export function Loans({
  loans,
  currency,
  creditScore,
  onRequestLoan,
  onPayLoan,
  onCancelLoan,
  isLoading,
}: LoansProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [paymentAmounts, setPaymentAmounts] = useState<Record<number, string>>({});

  const handleRequestLoan = () => {
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    onRequestLoan(amount);
    setRequestAmount("");
    setShowRequestForm(false);
  };

  const handlePayLoan = (loanId: number) => {
    const amountStr = paymentAmounts[loanId];
    const amount = amountStr ? parseFloat(amountStr) : undefined;
    
    if (amountStr && (isNaN(amount!) || amount! <= 0)) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    onPayLoan(loanId, amount);
    setPaymentAmounts((prev) => ({ ...prev, [loanId]: "" }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Loans</h2>
          <p className="text-sm text-gray-400">Manage your loans and credit</p>
        </div>
        <Button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request Loan
        </Button>
      </div>

      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <h3 className="text-lg font-semibold text-white mb-4">Request New Loan</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300 font-medium">Credit Score</span>
                </div>
                <p className="text-2xl font-bold text-white">{creditScore}</p>
              </div>
              <div>
                <Label htmlFor="loan-amount" className="text-gray-300">
                  Loan Amount
                </Label>
                <Input
                  id="loan-amount"
                  type="number"
                  placeholder="0.00"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRequestLoan}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Submit Request
                </Button>
                <Button
                  onClick={() => setShowRequestForm(false)}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {loans.length === 0 ? (
          <Card className="p-12 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="text-center">
              <Landmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No active loans</p>
            </div>
          </Card>
        ) : (
          loans.map((loan) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Loan #{loan.id}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(loan.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-xs text-orange-300 uppercase font-medium">
                      {loan.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-black/20 border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">Original</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(loan.amount, currency)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">Interest</p>
                    </div>
                    <p className="text-sm font-semibold text-orange-400">
                      {loan.interest}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">Remaining</p>
                    </div>
                    <p className="text-sm font-semibold text-red-400">
                      {formatCurrency(loan.remaining_balance, currency)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">Due Date</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {loan.days_remaining}d
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Next Payment</span>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(loan.next_payment, currency)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Payment amount (optional)"
                      value={paymentAmounts[loan.id] || ""}
                      onChange={(e) =>
                        setPaymentAmounts((prev) => ({
                          ...prev,
                          [loan.id]: e.target.value,
                        }))
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={() => handlePayLoan(loan.id)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    Pay
                  </Button>
                  <Button
                    onClick={() => onCancelLoan(loan.id)}
                    disabled={isLoading}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}