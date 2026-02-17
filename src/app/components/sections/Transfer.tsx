import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRightLeft, AlertCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatCurrency } from "@/utils/nui";
import { toast } from "sonner";

interface TransferProps {
  balance: number;
  currency: string;
  transferTaxPercent: number;
  maxTransfer: number;
  onTransfer: (targetIdentifier: string, amount: number) => void;
  isLoading: boolean;
}

export function Transfer({
  balance,
  currency,
  transferTaxPercent,
  maxTransfer,
  onTransfer,
  isLoading,
}: TransferProps) {
  const [targetIdentifier, setTargetIdentifier] = useState("");
  const [amount, setAmount] = useState("");

  const transferAmount = parseFloat(amount) || 0;
  const taxAmount = (transferAmount * transferTaxPercent) / 100;
  const totalAmount = transferAmount + taxAmount;

  const handleTransfer = () => {
    if (!targetIdentifier.trim()) {
      toast.error("Please enter a recipient identifier");
      return;
    }
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (transferAmount > maxTransfer) {
      toast.error(`Maximum transfer amount is ${formatCurrency(maxTransfer, currency)}`);
      return;
    }
    if (totalAmount > balance) {
      toast.error("Insufficient balance (including tax)");
      return;
    }
    onTransfer(targetIdentifier, transferAmount);
    setTargetIdentifier("");
    setAmount("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Transfer Funds</h2>
              <p className="text-sm text-gray-400">Send money to another account</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="recipient" className="text-gray-300">
                Recipient Identifier
              </Label>
              <Input
                id="recipient"
                type="text"
                placeholder="Enter player identifier"
                value={targetIdentifier}
                onChange={(e) => setTargetIdentifier(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white mt-2"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white mt-2"
                disabled={isLoading}
              />
            </div>

            {transferAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30"
              >
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-purple-300 font-medium">Transfer Summary</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Transfer Amount:</span>
                    <span className="text-white">{formatCurrency(transferAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax ({transferTaxPercent}%):</span>
                    <span className="text-orange-400">{formatCurrency(taxAmount, currency)}</span>
                  </div>
                  <div className="h-px bg-purple-500/30 my-2" />
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-white font-bold">{formatCurrency(totalAmount, currency)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleTransfer}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-[1.02] transition-all duration-200"
              size="lg"
            >
              Transfer Funds
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}