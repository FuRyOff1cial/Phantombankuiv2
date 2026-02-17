import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Transaction } from "@/types/bank";
import { formatCurrency, formatDate } from "@/utils/nui";
import { toast } from "sonner";

interface DashboardProps {
  balance: number;
  cash: number;
  transactions: Transaction[];
  currency: string;
  creditScore: number;
  creditScoreLabel: string | null;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  isLoading: boolean;
}

export function Dashboard({
  balance,
  cash,
  transactions,
  currency,
  creditScore,
  creditScoreLabel,
  onDeposit,
  onWithdraw,
  isLoading,
}: DashboardProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > cash) {
      toast.error("Insufficient cash");
      return;
    }
    onDeposit(amount);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    onWithdraw(amount);
    setWithdrawAmount("");
  };

  const recentTransactions = transactions.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 bank-glass-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400">Credit Score</h3>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{creditScore}</p>
            <p className="text-sm text-purple-300">{creditScoreLabel || "N/A"}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 bank-glass-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400">Total Assets</h3>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {formatCurrency(balance + cash, currency)}
            </p>
            <p className="text-sm text-green-300">Bank + Cash</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 bank-glass-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400">Transactions</h3>
              <TrendingDown className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{transactions.length}</p>
            <p className="text-sm text-orange-300">This period</p>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Deposit Cash</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleDeposit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                Deposit
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Withdraw Cash</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Withdraw
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              recentTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "deposit"
                          ? "bg-green-500/20"
                          : transaction.type === "withdraw"
                          ? "bg-red-500/20"
                          : "bg-blue-500/20"
                      }`}
                    >
                      {transaction.type === "deposit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-400" />
                      ) : transaction.type === "withdraw" ? (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.description || `${transaction.sender} → ${transaction.receiver}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === "deposit"
                          ? "text-green-400"
                          : transaction.type === "withdraw"
                          ? "text-red-400"
                          : "text-blue-400"
                      }`}
                    >
                      {transaction.type === "deposit" ? "+" : "-"}
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}