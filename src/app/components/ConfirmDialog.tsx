import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

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
      bg: "from-red-500/20 to-pink-500/20",
      border: "border-red-500/30",
      icon: "text-red-400",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "from-orange-500/20 to-yellow-500/20",
      border: "border-orange-500/30",
      icon: "text-orange-400",
      button: "bg-orange-600 hover:bg-orange-700",
    },
    info: {
      bg: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      icon: "text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const colors = variantColors[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4"
            >
              <Card
                className={`p-6 bg-[#1a1a2e] ${colors.border} border-2 bank-glass-blur shadow-2xl`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center ${colors.border} border`}
                    >
                      <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {description}
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 ${colors.button} hover:scale-[1.02] transition-all duration-200`}
                  >
                    {confirmText}
                  </Button>
                  <Button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white border-0 hover:scale-[1.02] transition-all duration-200 shadow-lg"
                  >
                    {cancelText}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}