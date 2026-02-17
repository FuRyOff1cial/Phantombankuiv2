import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Plus, Send, Check, X } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Invoice } from "@/types/bank";
import { formatCurrency, formatDate } from "@/utils/nui";
import { toast } from "sonner";

interface InvoicesProps {
  invoices: Invoice[];
  currency: string;
  playerIdentifier: string;
  onSendInvoice: (receiverIdentifier: string, amount: number, reason?: string) => void;
  onPayInvoice: (invoiceId: number) => void;
  onDeclineInvoice: (invoiceId: number) => void;
  isLoading: boolean;
}

export function Invoices({
  invoices,
  currency,
  playerIdentifier,
  onSendInvoice,
  onPayInvoice,
  onDeclineInvoice,
  isLoading,
}: InvoicesProps) {
  const [showSendForm, setShowSendForm] = useState(false);
  const [receiverIdentifier, setReceiverIdentifier] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSendInvoice = () => {
    if (!receiverIdentifier.trim()) {
      toast.error("Please enter a recipient identifier");
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    onSendInvoice(receiverIdentifier, amountNum, reason || undefined);
    setReceiverIdentifier("");
    setAmount("");
    setReason("");
    setShowSendForm(false);
  };

  const receivedInvoices = invoices.filter((inv) => inv.receiver === playerIdentifier);
  const sentInvoices = invoices.filter((inv) => inv.sender === playerIdentifier);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Invoices</h2>
          <p className="text-sm text-gray-400">Send and manage invoices</p>
        </div>
        <Button
          onClick={() => setShowSendForm(!showSendForm)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Send Invoice
        </Button>
      </div>

      {showSendForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Send New Invoice</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="receiver" className="text-gray-300">
                  Recipient Identifier
                </Label>
                <Input
                  id="receiver"
                  type="text"
                  placeholder="Enter player identifier"
                  value={receiverIdentifier}
                  onChange={(e) => setReceiverIdentifier(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="invoice-amount" className="text-gray-300">
                  Amount
                </Label>
                <Input
                  id="invoice-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="reason" className="text-gray-300">
                  Reason (Optional)
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Enter invoice reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white mt-2 resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSendInvoice}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Invoice
                </Button>
                <Button
                  onClick={() => setShowSendForm(false)}
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

      {/* Received Invoices */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Received Invoices</h3>
        <div className="space-y-3">
          {receivedInvoices.length === 0 ? (
            <Card className="p-8 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
              <p className="text-center text-gray-400">No received invoices</p>
            </Card>
          ) : (
            receivedInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-4 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">From: {invoice.sender}</p>
                        <p className="text-sm text-gray-400">
                          {invoice.reason || "No reason provided"}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(invoice.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(invoice.amount, currency)}
                        </p>
                        <p className="text-xs text-gray-500">Amount Due</p>
                      </div>
                      <Button
                        onClick={() => onPayInvoice(invoice.id)}
                        disabled={isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                      <Button
                        onClick={() => onDeclineInvoice(invoice.id)}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Sent Invoices */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Sent Invoices</h3>
        <div className="space-y-3">
          {sentInvoices.length === 0 ? (
            <Card className="p-8 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
              <p className="text-center text-gray-400">No sent invoices</p>
            </Card>
          ) : (
            sentInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-4 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">To: {invoice.receiver}</p>
                        <p className="text-sm text-gray-400">
                          {invoice.reason || "No reason provided"}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(invoice.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(invoice.amount, currency)}
                      </p>
                      <div className="flex items-center gap-2 mt-1 justify-end">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <p className="text-xs text-yellow-400 uppercase">{invoice.status}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
