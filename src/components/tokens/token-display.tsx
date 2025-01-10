import { cn } from "@/lib/utils";
import { Balance } from "@minima-global/mds";
import { motion, AnimatePresence } from "framer-motion";

interface TokenDisplayProps {
  token: Balance;
  balance?: Balance[];
  totalCoins?: number;
  tab?: string;
}

export function TokenDisplay({
  token,
  balance,
  totalCoins,
  tab,
}: TokenDisplayProps) {
  const isUnconfirmedBalance = balance?.[0].unconfirmed !== "0";

  return (
    <div className="space-y-3">
      <p className="text-sm truncate text-muted-foreground">
        <span
          className={cn(
            "font-medium text-primary py-[2px] px-2 mr-1 dark:bg-[#18181b] bg-[#ebebeb]"
          )}
        >
          Token ID:
        </span>
        {token.tokenid}
      </p>
      <div className="w-full h-[1px] bg-border" />

      <AnimatePresence>
        {!tab && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {typeof token.token === "object" && (
              <>
                <p className="text-sm text-muted-foreground">
                  <span
                    className={cn(
                      "font-medium text-primary py-[2px] px-2 mr-1 dark:bg-[#18181b] bg-[#ebebeb]"
                    )}
                  >
                    Description:
                  </span>
                  {token.token.description}
                </p>
                <div className="w-full h-[1px] bg-border" />
              </>
            )}

            {totalCoins && (
              <>
                <p className="text-sm text-muted-foreground">
                  <span
                    className={cn(
                      "font-medium text-primary py-[2px] px-2 mr-1 dark:bg-[#18181b] bg-[#ebebeb]"
                    )}
                  >
                    Total Coins:
                  </span>
                  {totalCoins}
                </p>
                <div className="w-full h-[1px] bg-border" />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BalanceDisplay
        label="Sendable"
        value={token.sendable}
        isUnconfirmed={isUnconfirmedBalance}
      />
      <div className="w-full h-[1px] bg-border" />
      <BalanceDisplay
        label="Confirmed"
        value={token.confirmed}
        isUnconfirmed={isUnconfirmedBalance}
      />
      <div className="w-full h-[1px] bg-border" />

      <BalanceDisplay
        label="Unconfirmed"
        value={token.unconfirmed}
        isUnconfirmed={isUnconfirmedBalance}
      />
    </div>
  );
}

interface BalanceDisplayProps {
  label: string;
  value: string;
  isUnconfirmed: boolean;
}

function BalanceDisplay({ label, value, isUnconfirmed }: BalanceDisplayProps) {
  return (
    <p
      className={cn(
        "text-sm",
        isUnconfirmed
          ? "text-yellow-600 animate-pulse font-bold"
          : "text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "font-medium text-primary py-[2px] px-2 mr-1 dark:bg-[#18181b] bg-[#ebebeb]",
          isUnconfirmed ? "animate-pulse" : ""
        )}
      >
        {label}:
      </span>
      {value}
    </p>
  );
}
