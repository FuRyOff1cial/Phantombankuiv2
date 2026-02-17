import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Plus, Lock, Unlock } from "lucide-react";
import { Card as UICard } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card } from "@/types/bank";
import { formatDate } from "@/utils/nui";
import { toast } from "sonner";

interface CardsProps {
  cards: Card[];
  onCreateCard: (pin: string, cardType: string) => void;
  onChangePin: (cardId: number, oldPin: string, newPin: string) => void;
  onSetCardStatus: (cardId: number, status: "active" | "blocked") => void;
  isLoading: boolean;
}

export function Cards({
  cards,
  onCreateCard,
  onChangePin,
  onSetCardStatus,
  isLoading,
}: CardsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createPin, setCreatePin] = useState("");
  const [cardType, setCardType] = useState("default");
  const [changingPin, setChangingPin] = useState<number | null>(null);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

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

  const handleChangePin = (cardId: number) => {
    if (!oldPin || !newPin || oldPin.length < 4 || newPin.length < 4) {
      toast.error("Please enter valid 4-digit PINs");
      return;
    }
    onChangePin(cardId, oldPin, newPin);
    setChangingPin(null);
    setOldPin("");
    setNewPin("");
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
          <h2 className="text-2xl font-bold text-white">Cards</h2>
          <p className="text-sm text-gray-400">Manage your bank cards</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
          <UICard className="p-6 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Card</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-type" className="text-gray-300">
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
                <Label htmlFor="create-pin" className="text-gray-300">
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Create Card
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
          </UICard>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {cards.length === 0 ? (
          <UICard className="col-span-2 p-12 bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No cards yet</p>
            </div>
          </UICard>
        ) : (
          cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <UICard className="overflow-hidden bg-[#1a1a2e]/60 border-purple-500/20 backdrop-blur-xl">
                {/* Card Visual */}
                <div
                  className={`p-6 bg-gradient-to-br ${
                    cardTypeColors[card.card_type as keyof typeof cardTypeColors] ||
                    cardTypeColors.default
                  } relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <CreditCard className="w-8 h-8 text-white/80" />
                      <span className="text-xs text-white/80 uppercase tracking-widest">
                        {card.card_type}
                      </span>
                    </div>
                    <p className="text-2xl font-mono tracking-wider text-white mb-4">
                      {card.card_number_masked}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/60">Expires</p>
                        <p className="text-sm text-white font-medium">
                          {formatDate(card.expires_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20">
                        {card.status === "active" ? (
                          <>
                            <Unlock className="w-3 h-3 text-green-300" />
                            <span className="text-xs text-white">Active</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-red-300" />
                            <span className="text-xs text-white">Blocked</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 space-y-3">
                  {changingPin === card.id ? (
                    <div className="space-y-3">
                      <Input
                        type="password"
                        maxLength={4}
                        placeholder="Old PIN"
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                        className="bg-black/30 border-purple-500/30 text-white"
                        disabled={isLoading}
                      />
                      <Input
                        type="password"
                        maxLength={4}
                        placeholder="New PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                        className="bg-black/30 border-purple-500/30 text-white"
                        disabled={isLoading}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleChangePin(card.id)}
                          disabled={isLoading}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setChangingPin(null);
                            setOldPin("");
                            setNewPin("");
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1 border-purple-500/30 text-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => setChangingPin(card.id)}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-500/30 text-gray-300 hover:bg-white/5"
                      >
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
                        className={`w-full ${
                          card.status === "active"
                            ? "bg-gradient-to-r from-red-500 to-pink-500"
                            : "bg-gradient-to-r from-green-500 to-emerald-500"
                        }`}
                      >
                        {card.status === "active" ? (
                          <>
                            <Lock className="w-3 h-3 mr-2" />
                            Block Card
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 mr-2" />
                            Activate Card
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </UICard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
