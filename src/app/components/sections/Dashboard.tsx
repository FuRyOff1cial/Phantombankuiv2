import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Transaction } from "@/types/bank";
import { formatCurrency, formatDate } from "@/utils/nui";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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

  // Prepare chart data - Balance history over last 7 days
  const balanceHistoryData = useMemo(() => {
    const days = 7;
    const data = [];
    let runningBalance = balance;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.created_at);
        return tDate.toDateString() === date.toDateString();
      });
      
      // Calculate balance for that day
      dayTransactions.forEach(t => {
        if (t.type === "deposit") {
          runningBalance -= t.amount;
        } else {
          runningBalance += t.amount;
        }
      });
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: Math.max(0, runningBalance),
        deposits: dayTransactions.filter(t => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0),
        withdrawals: dayTransactions.filter(t => t.type === "withdraw").reduce((sum, t) => sum + t.amount, 0),
      });
      
      runningBalance = balance; // Reset for next iteration
    }
    
    return data.reverse();
  }, [transactions, balance]);

  // Transaction type distribution
  const transactionTypeData = useMemo(() => {
    const deposits = transactions.filter(t => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = transactions.filter(t => t.type === "withdraw").reduce((sum, t) => sum + t.amount, 0);
    const transfers = transactions.filter(t => t.type === "transfer").reduce((sum, t) => sum + t.amount, 0);
    
    return [
      { name: "Deposits", value: deposits, color: "#10b981" },
      { name: "Withdrawals", value: withdrawals, color: "#ef4444" },
      { name: "Transfers", value: transfers, color: "#3b82f6" },
    ].filter(item => item.value > 0);
  }, [transactions]);

  // Calculate spending stats
  const spendingStats = useMemo(() => {
    const totalSpent = transactions
      .filter(t => t.type === "withdraw" || t.type === "transfer")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalEarned = transactions
      .filter(t => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      spent: totalSpent,
      earned: totalEarned,
      net: totalEarned - totalSpent,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.1,
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
          className="gpu-accelerate"
        >
          <Card className="p-6 bg-purple-900/60 border-2 border-purple-500/60 bank-glass-blur shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400" style={{ color: '#9ca3af' }}>Credit Score</h3>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1" style={{ color: '#ffffff' }}>{creditScore}</p>
            <p className="text-sm text-purple-300" style={{ color: '#d8b4fe' }}>{creditScoreLabel || "N/A"}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gpu-accelerate"
        >
          <Card className="p-6 bg-green-900/60 border-2 border-green-500/60 bank-glass-blur shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400" style={{ color: '#9ca3af' }}>Total Assets</h3>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1" style={{ color: '#ffffff' }}>
              {formatCurrency(balance + cash, currency)}
            </p>
            <p className="text-sm text-green-300" style={{ color: '#86efac' }}>Bank + Cash</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-orange-900/60 border-2 border-orange-500/60 bank-glass-blur shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400" style={{ color: '#9ca3af' }}>Transactions</h3>
              <TrendingDown className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1" style={{ color: '#ffffff' }}>{transactions.length}</p>
            <p className="text-sm text-orange-300" style={{ color: '#fdba74' }}>This period</p>
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
          <Card className="card-deposit p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-deposit w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center transition-all duration-300">
                <ArrowDownLeft className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white" style={{ color: '#ffffff' }}>Deposit Cash</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300" style={{ color: '#d1d5db' }}>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2 input-deposit"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleDeposit}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 hover:scale-[1.02] transition-all duration-200"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
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
          <Card className="card-withdraw p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-withdraw w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white" style={{ color: '#ffffff' }}>Withdraw Cash</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300" style={{ color: '#d1d5db' }}>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2 input-withdraw"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 hover:scale-[1.02] transition-all duration-200"
                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
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
        <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-purple-500/10 hover:border-purple-500/30 hover:shadow-md transition-all duration-200"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                        transaction.type === "deposit"
                          ? "bg-green-500/20 shadow-green-500/30"
                          : transaction.type === "withdraw"
                          ? "bg-red-500/20 shadow-red-500/30"
                          : "bg-blue-500/20 shadow-blue-500/30"
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
                      className={`font-bold text-lg ${
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

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Balance History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Balance History (7 Days)</h3>
            </div>
            {balanceHistoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={balanceHistoryData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`${formatCurrency(value, currency)}`, 'Balance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fill="url(#balanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </Card>
        </motion.div>

        {/* Transaction Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Transaction Distribution</h3>
            </div>
            {transactionTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => formatCurrency(value, currency)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No transactions yet
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Spending Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Period Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Total Earned</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(spendingStats.earned, currency)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Total Spent</p>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(spendingStats.spent, currency)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Net Flow</p>
              <p className={`text-2xl font-bold ${spendingStats.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {spendingStats.net >= 0 ? '+' : ''}{formatCurrency(spendingStats.net, currency)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}