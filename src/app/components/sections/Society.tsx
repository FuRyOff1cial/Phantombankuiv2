import { useState } from "react";
import { motion } from "motion/react";
import { Building2, ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Society as SocietyType } from "@/types/bank";
import { formatCurrency } from "@/utils/nui";
import { toast } from "sonner";

interface SocietyProps {
  society: SocietyType;
  cash: number;
  balance: number;
  currency: string;
  onDepositSociety: (amount: number) => void;
  onWithdrawSociety: (amount: number) => void;
  onTransferToSociety: (amount: number) => void;
  onTransferFromSociety: (amount: number) => void;
  isLoading: boolean;
}

export function Society({
  society,
  cash,
  balance,
  currency,
  onDepositSociety,
  onWithdrawSociety,
  onTransferToSociety,
  onTransferFromSociety,
  isLoading,
}: SocietyProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferToAmount, setTransferToAmount] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState("");
  const [removeFundsAmount, setRemoveFundsAmount] = useState("");

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
    onDepositSociety(amount);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > society.balance) {
      toast.error("Insufficient society balance");
      return;
    }
    onWithdrawSociety(amount);
    setWithdrawAmount("");
  };

  const handleTransferTo = () => {
    const amount = parseFloat(transferToAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient bank balance");
      return;
    }
    onTransferToSociety(amount);
    setTransferToAmount("");
  };

  const handleTransferFrom = () => {
    const amount = parseFloat(transferFromAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > society.balance) {
      toast.error("Insufficient society balance");
      return;
    }
    onTransferFromSociety(amount);
    setTransferFromAmount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Society Account</h2>
        <p className="text-sm text-gray-400">Manage your organization funds</p>
      </div>

      {/* Society Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 bank-glass-blur">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{society.jobLabel}</h3>
              <p className="text-sm text-purple-300">{society.jobName}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-400">Society Balance:</span>
            <span className="text-4xl font-bold text-white">
              {formatCurrency(society.balance, currency)}
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Deposit Cash to Society */}
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
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
              >
                Deposit
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Withdraw to Cash */}
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
                className="w-full bg-gradient-to-r from-red-500 to-pink-500"
              >
                Withdraw
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Transfer to Society */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Bank → Society</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={transferToAmount}
                  onChange={(e) => setTransferToAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleTransferTo}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Transfer to Society
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Transfer from Society */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Society → Bank</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={transferFromAmount}
                  onChange={(e) => setTransferFromAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleTransferFrom}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500"
              >
                Transfer to Bank
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}