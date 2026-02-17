import { Toaster as Sonner } from "sonner";

export function BankToaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(30, 30, 45, 0.95)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          color: "#fff",
        },
        className: "bank-toast",
      }}
    />
  );
}