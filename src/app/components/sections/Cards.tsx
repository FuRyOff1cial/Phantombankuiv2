import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Plus } from "lucide-react";
import { Card as UICard } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card } from "@/types/bank";
import { toast } from "sonner";
import { HolographicCard } from "../HolographicCard";

interface CardsProps {
  cards: Card[];
  onCreateCard: (pin: string, cardType: string) => void;
  onChangePin: (cardId: number, oldPin: string, newPin: string) => void;
  onSetCardStatus: (cardId: number, status: "active" | "blocked") => void;
  onReissueCard: (cardId: number) => void;
  onCancelCard: (cardId: number) => void;
  isLoading: boolean;
}

export function Cards({
  cards,
  onCreateCard,
  onChangePin,
  onSetCardStatus,
  onReissueCard,
  onCancelCard,
  isLoading,
}: CardsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createPin, setCreatePin] = useState("");
  const [cardType, setCardType] = useState("default");

  const handleCreateCard = () => {
    if (!createPin || createPin.length < 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }
    onCreateCard(createPin, cardType);
    setCreatePin("");
    setCardType("default");
    setShowCreateForm(false);
  };

  const cardTypeColors = {
    default: "from-slate-500 to-slate-700",
    gold: "from-yellow-500 to-orange-500",
    express: "from-purple-500 to-blue-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ color: '#ffffff' }}>Cards</h2>
          <p className="text-sm text-gray-400" style={{ color: '#9ca3af' }}>Manage your bank cards</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Card
        </Button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <UICard className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <h3 className="text-lg font-semibold text-white mb-4" style={{ color: '#ffffff' }}>Create New Card</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-type" className="text-gray-300" style={{ color: '#d1d5db' }}>
                  Card Type
                </Label>
                <Select value={cardType} onValueChange={setCardType}>
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-pin" className="text-gray-300" style={{ color: '#d1d5db' }}>
                  4-Digit PIN
                </Label>
                <Input
                  id="create-pin"
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={createPin}
                  onChange={(e) => setCreatePin(e.target.value.replace(/\D/g, ""))}
                  className="bg-black/30 border-purple-500/30 text-white mt-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateCard}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 hover:scale-[1.02] transition-all duration-200"
                >
                  Create Card
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white border-0 hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </UICard>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {cards.length === 0 ? (
          <UICard className="col-span-2 p-12 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400" style={{ color: '#9ca3af' }}>No cards yet</p>
              <p className="text-sm text-gray-500 mt-2" style={{ color: '#6b7280' }}>Create your first card to get started</p>
            </div>
          </UICard>
        ) : (
          cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HolographicCard
                card={card}
                onChangePin={onChangePin}
                onSetCardStatus={onSetCardStatus}
                onReissueCard={onReissueCard}
                onCancelCard={onCancelCard}
                isLoading={isLoading}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}