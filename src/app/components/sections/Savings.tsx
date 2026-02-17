import { useState } from "react";
import { motion } from "motion/react";
import { PiggyBank, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Savings as SavingsType } from "@/types/bank";
import { formatCurrency, formatTimeUntil } from "@/utils/nui";
import { toast } from "sonner";

interface SavingsProps {
  savings: SavingsType;
  balance: number;
  currency: string;
  onDepositSavings: (amount: number) => void;
  onWithdrawSavings: (amount: number) => void;
  isLoading: boolean;
}

export function Savings({
  savings,
  balance,
  currency,
  onDepositSavings,
  onWithdrawSavings,
  isLoading,
}: SavingsProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient bank balance");
      return;
    }
    onDepositSavings(amount);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > savings.balance) {
      toast.error("Insufficient savings balance");
      return;
    }
    onWithdrawSavings(amount);
    setWithdrawAmount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Savings Account</h2>
        <p className="text-sm text-gray-400">Earn interest on your deposits</p>
      </div>

      {/* Savings Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 bank-glass-blur">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <PiggyBank className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-green-300 mb-1">Savings Balance</h3>
              <p className="text-4xl font-bold text-white">
                {formatCurrency(savings.balance, currency)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/20 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Interest Rate</p>
              </div>
              <p className="text-2xl font-bold text-white">{savings.interest_rate}%</p>
              <p className="text-xs text-green-300 capitalize">{savings.frequency}</p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Total Earned</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(savings.total_interest_earned, currency)}
              </p>
              <p className="text-xs text-green-300">All time</p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Next Interest</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatTimeUntil(savings.next_interest_at)}
              </p>
              <p className="text-xs text-green-300">
                +{formatCurrency(savings.accrued_since_last, currency)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Deposit</h3>
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
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
              >
                Deposit to Savings
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Withdraw</h3>
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
                className="w-full bg-gradient-to-r from-red-500 to-pink-500"
              >
                Withdraw from Savings
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Interest Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Interest Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-purple-500/10">
              <span className="text-gray-400">Current Period Accrued</span>
              <span className="text-white font-semibold">
                {formatCurrency(savings.accrued_since_last, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-purple-500/10">
              <span className="text-gray-400">Interest Frequency</span>
              <span className="text-white font-semibold capitalize">{savings.frequency}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-purple-500/10">
              <span className="text-gray-400">Next Payment In</span>
              <span className="text-white font-semibold">
                {formatTimeUntil(savings.next_interest_at)}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}