import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Filter, X, Calendar, DollarSign, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface TransactionFilterState {
  type?: string;
  date_from?: number;
  date_to?: number;
  amount_min?: number;
  amount_max?: number;
  search?: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilterState;
  onFilterChange: (filters: TransactionFilterState) => void;
  onClear: () => void;
}

export function TransactionFilters({
  filters,
  onFilterChange,
  onClear,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (type: string) => {
    if (filters.type === type) {
      onFilterChange({ ...filters, type: undefined });
    } else {
      onFilterChange({ ...filters, type });
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="border-purple-500/30 text-gray-300 hover:bg-white/5 relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Card className="p-6 bg-[#1a1a2e]/88 border-purple-500/20 bank-glass-blur">
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <Label className="text-gray-300 flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Label>
                  <Input
                    type="text"
                    placeholder="Search description, sender, receiver..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      onFilterChange({ ...filters, search: e.target.value })
                    }
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>

                {/* Transaction Type */}
                <div>
                  <Label className="text-gray-300 mb-2 block">
                    Transaction Type
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {["deposit", "withdraw", "transfer", "loan"].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                          filters.type === type
                            ? "bg-purple-500/30 border-purple-500 text-white"
                            : "bg-black/20 border-purple-500/20 text-gray-400 hover:border-purple-500/40 hover:text-white"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      From Date
                    </Label>
                    <Input
                      type="date"
                      value={
                        filters.date_from
                          ? new Date(filters.date_from * 1000)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          date_from: e.target.value
                            ? Math.floor(
                                new Date(e.target.value).getTime() / 1000
                              )
                            : undefined,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      To Date
                    </Label>
                    <Input
                      type="date"
                      value={
                        filters.date_to
                          ? new Date(filters.date_to * 1000)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          date_to: e.target.value
                            ? Math.floor(
                                new Date(e.target.value).getTime() / 1000
                              )
                            : undefined,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                {/* Amount Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Min Amount
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={filters.amount_min || ""}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          amount_min: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Max Amount
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={filters.amount_max || ""}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          amount_max: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
