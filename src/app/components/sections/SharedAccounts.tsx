import { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  UserMinus,
  Crown,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SharedAccount, SharedAccountMember } from "@/types/bank";
import { formatCurrency } from "@/utils/nui";
import { toast } from "sonner";
import { fetchNUI } from "@/utils/nui";

interface SharedAccountsProps {
  sharedAccounts: SharedAccount[];
  cash: number;
  currency: string;
  onCreateAccount: (accountName: string) => void;
  onDepositShared: (accountId: number, amount: number) => void;
  onWithdrawShared: (accountId: number, amount: number) => void;
  onAddMember: (accountId: number, targetIdentifier: string) => void;
  onRemoveMember: (accountId: number, targetIdentifier: string) => void;
  isLoading: boolean;
}

export function SharedAccounts({
  sharedAccounts,
  cash,
  currency,
  onCreateAccount,
  onDepositShared,
  onWithdrawShared,
  onAddMember,
  onRemoveMember,
  isLoading,
}: SharedAccountsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [depositAmounts, setDepositAmounts] = useState<Record<number, string>>({});
  const [withdrawAmounts, setWithdrawAmounts] = useState<Record<number, string>>({});
  const [managingAccount, setManagingAccount] = useState<number | null>(null);
  const [members, setMembers] = useState<SharedAccountMember[]>([]);
  const [newMemberIdentifier, setNewMemberIdentifier] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);

  const handleCreateAccount = () => {
    if (!accountName.trim()) {
      toast.error("Please enter an account name");
      return;
    }
    onCreateAccount(accountName);
    setAccountName("");
    setShowCreateForm(false);
  };

  const handleDeposit = (accountId: number) => {
    const amount = parseFloat(depositAmounts[accountId] || "");
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > cash) {
      toast.error("Insufficient cash");
      return;
    }
    onDepositShared(accountId, amount);
    setDepositAmounts((prev) => ({ ...prev, [accountId]: "" }));
  };

  const handleWithdraw = (accountId: number, balance: number) => {
    const amount = parseFloat(withdrawAmounts[accountId] || "");
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient account balance");
      return;
    }
    onWithdrawShared(accountId, amount);
    setWithdrawAmounts((prev) => ({ ...prev, [accountId]: "" }));
  };

  const handleManageMembers = async (accountId: number) => {
    setManagingAccount(accountId);
    setLoadingMembers(true);
    try {
      const response = await fetchNUI<{
        success: boolean;
        members?: SharedAccountMember[];
      }>("getSharedAccountMembers", { accountId });
      if (response.success && response.members) {
        setMembers(response.members);
      } else {
        toast.error("Failed to load members");
        setManagingAccount(null);
      }
    } catch (error) {
      toast.error("Failed to load members");
      setManagingAccount(null);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAddMember = () => {
    if (!newMemberIdentifier.trim()) {
      toast.error("Please enter a member identifier");
      return;
    }
    if (managingAccount) {
      onAddMember(managingAccount, newMemberIdentifier);
      setNewMemberIdentifier("");
    }
  };

  const handleRemoveMember = (targetIdentifier: string) => {
    if (managingAccount) {
      onRemoveMember(managingAccount, targetIdentifier);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Shared Accounts</h2>
          <p className="text-sm text-gray-400">Manage joint accounts</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Create Shared Account</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="account-name" className="text-gray-300">
                  Account Name
                </Label>
                <Input
                  id="account-name"
                  type="text"
                  placeholder="Enter account name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateAccount}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] transition-all duration-200"
                >
                  Create
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Member Management Modal */}
      {managingAccount !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setManagingAccount(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card className="p-6 bg-[#1a1a2e] border-purple-500/30 bank-glass-blur shadow-2xl shadow-purple-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Manage Members</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Member identifier"
                    value={newMemberIdentifier}
                    onChange={(e) => setNewMemberIdentifier(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleAddMember}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loadingMembers ? (
                  <p className="text-center text-gray-400 py-4">Loading members...</p>
                ) : members.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">No members</p>
                ) : (
                  members.map((member, index) => (
                    <motion.div
                      key={member.identifier}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {member.role === "owner" && (
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{member.identifier}</p>
                          <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                        </div>
                      </div>
                      {member.role !== "owner" && (
                        <Button
                          onClick={() => handleRemoveMember(member.identifier)}
                          disabled={isLoading}
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <UserMinus className="w-3 h-3" />
                        </Button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              <Button
                onClick={() => setManagingAccount(null)}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-[1.02] transition-all duration-200"
              >
                Close
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <div className="space-y-4">
        {sharedAccounts.length === 0 ? (
          <Card className="p-12 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No shared accounts yet</p>
            </div>
          </Card>
        ) : (
          sharedAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 capitalize">{account.role}</span>
                        {account.role === "owner" && (
                          <Crown className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(account.balance, currency)}
                    </p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="card-deposit space-y-2 p-3 rounded-lg bg-black/10 border border-purple-500/10 transition-all duration-300">
                    <Label className="text-gray-300 text-sm">Deposit</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={depositAmounts[account.id] || ""}
                        onChange={(e) =>
                          setDepositAmounts((prev) => ({
                            ...prev,
                            [account.id]: e.target.value,
                          }))
                        }
                        className="bg-black/30 border-purple-500/30 text-white input-deposit"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={() => handleDeposit(account.id)}
                        disabled={isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <ArrowDownLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="card-withdraw space-y-2 p-3 rounded-lg bg-black/10 border border-purple-500/10 transition-all duration-300">
                    <Label className="text-gray-300 text-sm">Withdraw</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmounts[account.id] || ""}
                        onChange={(e) =>
                          setWithdrawAmounts((prev) => ({
                            ...prev,
                            [account.id]: e.target.value,
                          }))
                        }
                        className="bg-black/30 border-purple-500/30 text-white input-withdraw"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={() => handleWithdraw(account.id, account.balance)}
                        disabled={isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {account.role === "owner" && (
                  <Button
                    onClick={() => handleManageMembers(account.id)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400 transition-all duration-200 shadow-md"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Members
                  </Button>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}