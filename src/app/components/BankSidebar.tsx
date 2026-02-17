import { motion } from "motion/react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  FileText,
  PiggyBank,
  Building2,
  Users,
  Landmark,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { BankConfig, Society, SharedAccount, Savings } from "@/types/bank";

interface BankSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  config: BankConfig;
  society: Society | null;
  sharedAccounts: SharedAccount[];
  savings: Savings | null;
  isAtm: boolean;
  onLogout: () => void;
  creditScore?: number;
}

export function BankSidebar({
  activeSection,
  onSectionChange,
  config,
  society,
  sharedAccounts,
  savings,
  isAtm,
  onLogout,
  creditScore,
}: BankSidebarProps) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      id: "transfer",
      label: "Transfer",
      icon: ArrowLeftRight,
      show: true,
    },
    {
      id: "cards",
      label: "Cards",
      icon: CreditCard,
      show: config.enableCards && !isAtm,
    },
    {
      id: "savings",
      label: "Savings",
      icon: PiggyBank,
      show: config.enableSavingsAccounts && !isAtm,
    },
    {
      id: "loans",
      label: "Loans",
      icon: Landmark,
      show: config.enableLoans && !isAtm,
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: FileText,
      show: config.enableInvoices && !isAtm,
    },
    {
      id: "society",
      label: "Society",
      icon: Building2,
      show: config.enableSocietyAccounts && society !== null && !isAtm,
    },
    {
      id: "shared",
      label: "Shared Accounts",
      icon: Users,
      show: config.enableSharedAccounts && !isAtm,
    },
  ];

  return (
    <div className="w-64 h-full bg-[#0f0f1e] bank-sidebar-glass border-r border-purple-500/30 flex flex-col shadow-2xl shadow-black/50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <motion.div
            className="flex items-center gap-3 p-3 border-b border-purple-500/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white" style={{ color: '#ffffff' }}>Phantom Bank</h1>
              {isAtm && <p className="text-xs text-purple-300" style={{ color: '#d8b4fe' }}>ATM Mode</p>}
            </div>
          </motion.div>

          {/* Credit Score Section */}
          {!isAtm && creditScore !== undefined && (
            <motion.div
              className="mt-3 p-3 rounded-lg border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-blue-900/40 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.3) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Credit Score</span>
                </div>
                <div className="flex items-end justify-between">
                  <motion.div
                    className="text-3xl font-bold text-white"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    {creditScore}
                  </motion.div>
                  <div className="text-xs text-purple-300 font-medium">
                    {creditScore >= 800 ? "Excellent" : creditScore >= 700 ? "Good" : creditScore >= 600 ? "Fair" : "Poor"}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: creditScore >= 700 
                        ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                        : creditScore >= 600
                        ? "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)"
                        : "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(creditScore / 850) * 100}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems
            .filter((item) => item.show)
            .map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const showBadge = item.id === "shared" && sharedAccounts.length > 0;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                    transition-all duration-200 relative group
                    ${
                      isActive
                        ? "bg-purple-900/50 text-white shadow-lg shadow-purple-500/20 border border-purple-500/50"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.02 }}
                >
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r shadow-lg shadow-purple-500/50"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-purple-500/10 rounded-lg blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </>
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 ${
                      isActive ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : ""
                    }`}
                  />
                  <span className="font-medium relative z-10">{item.label}</span>
                  {showBadge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-purple-500/50 relative z-10"
                    >
                      {sharedAccounts.length}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-purple-500/30">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-600/20 text-red-400 hover:text-white hover:bg-red-600 transition-all duration-200 group border border-red-500/30"
          whileHover={{ x: 4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut
            className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-200"
          />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}