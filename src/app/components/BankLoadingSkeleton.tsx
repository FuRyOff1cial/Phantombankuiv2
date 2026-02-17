import { motion } from "motion/react";
import { Skeleton } from "./ui/skeleton";

export function BankLoadingSkeleton() {
  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-lg bg-[#1a1a2e]/60 border border-purple-500/20"
          >
            <Skeleton className="h-4 w-24 mb-4 bg-purple-500/20" />
            <Skeleton className="h-8 w-32 mb-2 bg-purple-500/20" />
            <Skeleton className="h-3 w-20 bg-purple-500/20" />
          </motion.div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg bg-[#1a1a2e]/60 border border-purple-500/20"
          >
            <Skeleton className="h-6 w-32 mb-4 bg-purple-500/20" />
            <Skeleton className="h-10 w-full mb-2 bg-purple-500/20" />
            <Skeleton className="h-10 w-full bg-purple-500/20" />
          </motion.div>
        ))}
      </div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-lg bg-[#1a1a2e]/60 border border-purple-500/20"
      >
        <Skeleton className="h-6 w-48 mb-4 bg-purple-500/20" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-black/20"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg bg-purple-500/20" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2 bg-purple-500/20" />
                  <Skeleton className="h-3 w-24 bg-purple-500/20" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-20 mb-1 bg-purple-500/20" />
                <Skeleton className="h-3 w-16 bg-purple-500/20" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
