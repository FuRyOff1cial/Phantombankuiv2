import { motion } from "motion/react";
import { Wallet, CreditCard, Copy, Check, X } from "lucide-react";
import { useState, ReactNode } from "react";
import { toast } from "sonner";

interface BankHeaderProps {
  playerName: string | null;
  iban: string;
  balance: number;
  cash: number;
  currency: string;
  onClose?: () => void;
  notificationCenter?: ReactNode;
}

export function BankHeader({
  playerName,
  iban,
  balance,
  cash,
  currency,
  onClose,
  notificationCenter,
}: BankHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyIban = async () => {
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      toast.success("IBAN copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy IBAN");
    }
  };

  return (
    <div className="h-20 border-b border-purple-500/20 bg-[#0f0f1e] bank-header-glass">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {playerName || "Welcome"}
            </h2>
            <motion.button
              onClick={handleCopyIban}
              className="flex items-center gap-2 text-sm text-purple-300 font-mono hover:text-purple-200 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{iban}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center gap-6">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
              whileHover={{ scale: 1.02 }}
            >
              <Wallet className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Bank Balance</p>
                <p className="text-sm font-bold text-white">
                  {currency}{balance.toLocaleString()}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
              whileHover={{ scale: 1.02 }}
            >
              <CreditCard className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Cash</p>
                <p className="text-sm font-bold text-white">
                  {currency}{cash.toLocaleString()}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side: Notifications + Close */}
        <div className="flex items-center gap-4">
          {notificationCenter}
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-500/20 text-gray-400 hover:text-white transition-all duration-200"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}