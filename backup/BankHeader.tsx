import { motion } from "motion/react";
import { Wallet, CreditCard } from "lucide-react";

interface BankHeaderProps {
  playerName: string;
  iban: string;
  balance: number;
  cash: number;
  currency: string;
}

export function BankHeader({
  playerName,
  iban,
  balance,
  cash,
  currency,
}: BankHeaderProps) {
  return (
    <div className="h-20 border-b border-purple-500/20 bg-[#0f0f1e] bank-header-glass">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {playerName || "Welcome"}
            </h2>
            <p className="text-sm text-purple-300 font-mono">{iban}</p>
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
      </div>
    </div>
  );
}
