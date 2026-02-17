// NUI Communication utilities

import { CallbackResponse } from "@/types/bank";

export async function fetchNUI<T = CallbackResponse>(
  callback: string,
  data: Record<string, any> = {}
): Promise<T> {
  const isDev = import.meta.env.DEV;
  
  // In development mode, return a mock success response for non-critical actions
  if (isDev && (callback === "close" || callback === "logout")) {
    return { success: true } as T;
  }

  const response = await fetch(`https://phantom_bank/${callback}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// Error message translations
export const errorMessages: Record<string, string> = {
  invalid_amount: "Invalid or negative amount",
  insufficient_cash: "Not enough cash",
  insufficient_balance: "Not enough bank balance",
  invalid: "Invalid data or ID",
  invalid_loan: "Invalid loan",
  invalid_invoice: "Invalid invoice",
  invalid_card: "Invalid card",
  low_credit: "Credit score too low for loan",
  disabled: "Feature disabled",
  no_job: "No job assigned",
  not_member: "Not a member of this account",
  over_limit: "Over limit",
  over_max_balance: "Over maximum balance",
  error: "An error occurred",
  invalid_pin: "Invalid PIN",
  invalid_status: "Invalid status",
};

export function getErrorMessage(code: string): string {
  return errorMessages[code] || "An unknown error occurred";
}

// Format currency
export function formatCurrency(amount: number | undefined, currency: string = "$"): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currency}0`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

// Format date
export function formatDate(timestamp: number | string): string {
  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format time until
export function formatTimeUntil(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;
  
  if (diff < 0) return "Expired";
  
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}