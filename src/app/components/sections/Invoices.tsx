import { motion } from "motion/react";
import { FileText, Check, X, Clock, AlertCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Invoice } from "@/types/bank";
import { formatCurrency, formatDate } from "@/utils/nui";
import { EmptyState } from "../EmptyState";

interface InvoicesProps {
  invoices: Invoice[];
  currency: string;
  playerIdentifier: string;
  onPayInvoice: (invoiceId: number) => void;
  onDeclineInvoice: (invoiceId: number) => void;
  isLoading: boolean;
}

export function Invoices({
  invoices,
  currency,
  playerIdentifier,
  onPayInvoice,
  onDeclineInvoice,
  isLoading,
}: InvoicesProps) {
  // Only show received invoices
  const receivedInvoices = invoices.filter((inv) => inv.receiver === playerIdentifier);

  // Separate by status
  const pendingInvoices = receivedInvoices.filter((inv) => inv.status === "pending" || inv.status === "unpaid");
  const otherInvoices = receivedInvoices.filter((inv) => inv.status !== "pending" && inv.status !== "unpaid");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-400";
      case "pending":
      case "unpaid":
        return "text-yellow-400";
      case "declined":
      case "expired":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const isExpired = (invoice: Invoice) => {
    if (!invoice.expires_at) return false;
    return invoice.expires_at * 1000 < Date.now();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Invoices</h2>
        <p className="text-sm text-gray-400">
          Manage your received invoices • Sending invoices is handled by job billing systems
        </p>
      </div>

      {/* No invoices at all */}
      {receivedInvoices.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No Invoices"
          description="You don't have any received invoices. Invoices from businesses and services will appear here."
        />
      )}

      {/* Pending Invoices */}
      {pendingInvoices.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-white">Pending Invoices</h3>
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/30">
              {pendingInvoices.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">From: {invoice.sender}</p>
                        <p className="text-sm text-gray-400">
                          {invoice.reason || "No reason provided"}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(invoice.created_at)}
                          </p>
                          {isExpired(invoice) && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Expired
                            </p>
                          )}
                          {invoice.expires_at && !isExpired(invoice) && (
                            <p className="text-xs text-yellow-400 flex items-center gap-1">
                              Expires: {formatDate(new Date(invoice.expires_at * 1000).toISOString())}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-2xl font-bold text-red-400">
                          -{formatCurrency(invoice.amount, currency)}
                        </p>
                        <p className="text-xs text-gray-500">Amount Due</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => onPayInvoice(invoice.id)}
                          disabled={isLoading || isExpired(invoice)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 hover:scale-[1.02] transition-all duration-200"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Pay
                        </Button>
                        <Button
                          onClick={() => onDeclineInvoice(invoice.id)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white border-0 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-red-500/20"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice History (Paid/Declined/Expired) */}
      {otherInvoices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Invoice History</h3>
          <div className="space-y-3">
            {otherInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-[#1a1a2e]/50 border-purple-500/10 bank-glass-blur shadow-lg opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white opacity-60" />
                      </div>
                      <div>
                        <p className="text-white font-medium">From: {invoice.sender}</p>
                        <p className="text-sm text-gray-400">
                          {invoice.reason || "No reason provided"}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-500">{formatDate(invoice.created_at)}</p>
                          <span
                            className={`text-xs uppercase font-medium ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-400">
                        {formatCurrency(invoice.amount, currency)}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}