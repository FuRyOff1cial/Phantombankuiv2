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
      id: "cards",
      label: "Cards",
      icon: CreditCard,
      show: config.enableCards && !isAtm,
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
    {
      id: "savings",
      label: "Savings",
      icon: PiggyBank,
      show: config.enableSavingsAccounts && !isAtm,
    },
  ];

  return (
    <div className="w-64 h-full bg-[#0f0f1e] bank-sidebar-glass border-r border-purple-500/20 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Phantom Bank</h1>
            <p className="text-xs text-purple-300">{isAtm ? "ATM Mode" : "Full Access"}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 relative group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-purple-500/20">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}
