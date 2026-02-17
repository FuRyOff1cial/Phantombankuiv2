import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: {
      borderColor: "rgba(239, 68, 68, 0.5)",
      iconColor: "#ef4444",
      buttonBg: "#dc2626",
      buttonHoverBg: "#b91c1c",
    },
    warning: {
      borderColor: "rgba(249, 115, 22, 0.5)",
      iconColor: "#f97316",
      buttonBg: "#ea580c",
      buttonHoverBg: "#c2410c",
    },
    info: {
      borderColor: "rgba(59, 130, 246, 0.5)",
      iconColor: "#3b82f6",
      buttonBg: "#2563eb",
      buttonHoverBg: "#1d4ed8",
    },
  };

  const colors = variantColors[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Semi-transparent backdrop to see content behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[9999]"
            style={{ 
              backgroundColor: "rgba(0, 0, 0, 0.7)"
            }}
            onClick={onClose}
          />
          
          {/* Content container */}
          <div className="absolute inset-0 z-[10000] flex items-center justify-center pointer-events-none">
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 pointer-events-auto"
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
                  border: `2px solid ${colors.borderColor}`,
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${colors.borderColor}`,
                      }}
                    >
                      <AlertTriangle className="w-5 h-5" style={{ color: colors.iconColor }} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-300 mb-5 leading-relaxed pl-1 text-sm">
                  {description}
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 hover:scale-[1.02] transition-all duration-200 font-semibold text-sm"
                    style={{
                      backgroundColor: colors.buttonBg,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.buttonHoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.buttonBg;
                    }}
                  >
                    {confirmText}
                  </Button>
                  <Button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-0 hover:scale-[1.02] transition-all duration-200 shadow-lg font-semibold text-sm"
                  >
                    {cancelText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}