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
            <h2 className="text-lg font-semibold text-white" style={{ color: '#ffffff' }}>
              {playerName || "Welcome"}
            </h2>
            <p className="text-sm text-gray-400" style={{ color: '#9ca3af' }}>
              IBAN: {iban}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/50 border-2 border-purple-500/60"
              whileHover={{ scale: 1.02 }}
            >
              <Wallet className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400" style={{ color: '#9ca3af' }}>Bank Balance</p>
                <p className="text-sm font-bold text-white" style={{ color: '#ffffff' }}>
                  {currency}{balance.toLocaleString()}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900/50 border-2 border-green-500/60"
              whileHover={{ scale: 1.02 }}
            >
              <CreditCard className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs text-gray-400" style={{ color: '#9ca3af' }}>Cash</p>
                <p className="text-sm font-bold text-white" style={{ color: '#ffffff' }}>
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