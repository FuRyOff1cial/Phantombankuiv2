import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Lock, Unlock, Eye, EyeOff, RotateCw, Trash2 } from "lucide-react";
import { Card as CardType } from "@/types/bank";
import { formatDate } from "@/utils/nui";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card as UICard } from "./ui/card";
import { ConfirmDialog } from "./ConfirmDialog";

interface HolographicCardProps {
  card: CardType;
  onChangePin: (cardId: number, oldPin: string, newPin: string) => void;
  onSetCardStatus: (cardId: number, status: "active" | "blocked") => void;
  onReissueCard: (cardId: number) => void;
  onCancelCard: (cardId: number) => void;
  isLoading: boolean;
}

const cardTypeColors = {
  default: {
    from: "#64748b",
    to: "#334155",
    accent: "#94a3b8",
  },
  gold: {
    from: "#f59e0b",
    to: "#ea580c",
    accent: "#fbbf24",
  },
  express: {
    from: "#a855f7",
    to: "#3b82f6",
    accent: "#c084fc",
  },
};

export function HolographicCard({
  card,
  onChangePin,
  onSetCardStatus,
  onReissueCard,
  onCancelCard,
  isLoading,
}: HolographicCardProps) {
  const [changingPin, setChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleChangePinClick = () => {
    if (changingPin && oldPin && newPin && oldPin.length === 4 && newPin.length === 4) {
      onChangePin(card.id, oldPin, newPin);
      setChangingPin(false);
      setOldPin("");
      setNewPin("");
    } else {
      setChangingPin(!changingPin);
      setOldPin("");
      setNewPin("");
    }
  };

  const handleCancelCard = () => {
    onCancelCard(card.id);
    setShowCancelDialog(false);
  };

  const colors = cardTypeColors[card.card_type as keyof typeof cardTypeColors] || cardTypeColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      className="w-full gpu-accelerate"
    >
      <UICard className="overflow-hidden bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-shadow duration-300">
        {/* Card Visual */}
        <div
          className="p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          }}
        >
          {/* Animated gradient shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CreditCard className="w-10 h-10 text-white/90 drop-shadow-lg" />
              </motion.div>
              <div className="text-right">
                <span className="text-xs text-white/80 uppercase tracking-widest font-bold drop-shadow-md">
                  {card.card_type}
                </span>
                <p className="text-[10px] text-white/60 mt-1">Phantom Bank</p>
              </div>
            </div>

            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-2xl font-mono tracking-[0.3em] text-white drop-shadow-lg mb-2 font-bold">
                {showDetails && card.card_number_full
                  ? card.card_number_full
                  : card.card_number_masked}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1"
              >
                {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showDetails ? "Hide" : "Show"} details
              </button>
            </motion.div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide">Expires</p>
                <p className="text-sm text-white font-medium drop-shadow-md">
                  {formatDate(card.expires_at)}
                </p>
              </div>
              {showDetails && card.cvv && (
                <div className="mr-auto ml-8">
                  <p className="text-xs text-white/60 uppercase tracking-wide">CVV</p>
                  <p className="text-sm text-white font-medium drop-shadow-md font-mono">
                    {card.cvv}
                  </p>
                </div>
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  card.status === "active"
                    ? "bg-green-500/30 backdrop-blur-sm border border-green-400/50"
                    : "bg-red-500/30 backdrop-blur-sm border border-red-400/50"
                }`}
              >
                {card.status === "active" ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-green-200 drop-shadow-md" />
                    <span className="text-xs text-white font-semibold">Active</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-red-200 drop-shadow-md" />
                    <span className="text-xs text-white font-semibold">Blocked</span>
                  </>
                )}
              </motion.div>
            </div>
          </div>

          {/* Decorative circuit pattern */}
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        </div>

        {/* Card Actions */}
        <div className="p-4 space-y-3">
          {changingPin ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <Input
                type="password"
                maxLength={4}
                placeholder="Old PIN (4 digits)"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                className="bg-black/30 border-purple-500/30 text-white"
                disabled={isLoading}
              />
              <Input
                type="password"
                maxLength={4}
                placeholder="New PIN (4 digits)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="bg-black/30 border-purple-500/30 text-white"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleChangePinClick}
                  disabled={isLoading || !oldPin || !newPin || oldPin.length < 4 || newPin.length < 4}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 hover:scale-[1.02] transition-all duration-200"
                >
                  Save PIN
                </Button>
                <Button
                  onClick={() => {
                    setChangingPin(false);
                    setOldPin("");
                    setNewPin("");
                  }}
                  size="sm"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white border-0 hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <Button
                onClick={() => setChangingPin(true)}
                disabled={isLoading}
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Lock className="w-3.5 h-3.5 mr-2" />
                Change PIN
              </Button>
              <Button
                onClick={() =>
                  onSetCardStatus(
                    card.id,
                    card.status === "active" ? "blocked" : "active"
                  )
                }
                disabled={isLoading}
                size="sm"
                className={`w-full hover:scale-[1.02] transition-all duration-200 shadow-lg ${
                  card.status === "active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {card.status === "active" ? (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-2" />
                    Block Card
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 mr-2" />
                    Activate Card
                  </>
                )}
              </Button>
              <Button
                onClick={() => onReissueCard(card.id)}
                disabled={isLoading}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <RotateCw className="w-3.5 h-3.5 mr-2" />
                Reissue Card
              </Button>
              <Button
                onClick={() => setShowCancelDialog(true)}
                disabled={isLoading}
                size="sm"
                className="w-full bg-red-700 hover:bg-red-800 text-white shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Cancel Card
              </Button>
            </>
          )}
        </div>
      </UICard>
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelCard}
        title="Cancel card?"
        description="Are you sure you want to cancel this card? This action cannot be undone."
        confirmText="Yes, cancel"
        cancelText="No"
        variant="danger"
        isLoading={isLoading}
      />
    </motion.div>
  );
}