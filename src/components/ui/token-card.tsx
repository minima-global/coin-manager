import { CheckIcon, Coins, CopyIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Balance, Coin, Tokens } from "@minima-global/mds"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar"
import { ManualConsolidationDialog } from "../dialogs/consolidation-dialog"

interface TokenCardProps {
  token: Tokens.TokenResponseSingle
  isLinkEnabled: boolean
  type: "showcase" | "token"
  totalCoins?: number
  balance?: Balance.Balance
}

export function TokenCard({
  token,
  isLinkEnabled,
  type,
  totalCoins,
  balance,
}: TokenCardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(token, null, 2))
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      setIsCopied(false)
    }
  }

  const CardContent = (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Coins className="h-6 w-6 text-primary" />
          <div>
            <p className="font-medium">
              {typeof token.response.name === "string"
                ? token.response.name
                : token.response.name.name || "Unknown Token"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {type === "token" && (
            <Button variant="outline" size="sm" onClick={() => {}}>
              Manage
            </Button>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopyToken}>
                  <motion.div
                    animate={{
                      scale: isCopied ? [1, 1.2, 0.9, 1] : 1,
                      rotate: isCopied ? [0, 15, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isCopied ? 0 : 1,
                        y: isCopied ? -20 : 0,
                        position: "absolute",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isCopied ? 1 : 0,
                        y: isCopied ? 0 : 20,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckIcon className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {type === "showcase" && typeof token.response.name !== "string" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Amount:
            </span>
            {Number(balance?.response[0].total).toFixed(2)}
          </p>

          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Description:
            </span>
            {token.response.name.description}
          </p>
          <div className="w-full h-[1px] bg-border" />
          <p className="text-sm truncate text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Token ID:
            </span>
            {token.response.tokenid}
          </p>
          <div className="w-full h-[1px] bg-border" />
          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Total:
            </span>
            {token.response.total}
          </p>
          <div className="w-full h-[1px] bg-border" />
          {totalCoins && (
            <>
              <p className="text-sm text-muted-foreground">
                <span
                  className={cn(
                    "font-medium text-primary py-[2px] px-2 mr-1",
                    balance?.response[0].unconfirmed !== "0"
                      ? "animate-pulse bg-yellow-100 text-yellow-600"
                      : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
                  )}
                >
                  Total Coins:
                </span>
                {totalCoins}
              </p>
              <div className="w-full h-[1px] bg-border" />
            </>
          )}
          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Web Validated:
            </span>
            {token.response.name.webvalidate ? "Yes" : "N/A"}
          </p>
          <div className="w-full h-[1px] bg-border" />

          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Sendable:
            </span>
            {Number(balance?.response[0].sendable).toFixed(2)}
          </p>
          <div className="w-full h-[1px] bg-border" />
          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Confirmed:
            </span>
            {Number(balance?.response[0].confirmed).toFixed(2)}
          </p>
          <div className="w-full h-[1px] bg-border" />
          <p className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-medium text-primary py-[2px] px-2 mr-1",
                balance?.response[0].unconfirmed !== "0"
                  ? "animate-pulse bg-yellow-100 text-yellow-600"
                  : "dark:bg-[#18181b] bg-[#ebebeb] text-primary"
              )}
            >
              Unconfirmed:
            </span>
            {Number(balance?.response[0].confirmed).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )

  const cardClasses =
    "bg-card rounded-lg shadow transition-all duration-300 ease-in-out hover:bg-card/80 hover:shadow-md"

  return isLinkEnabled ? (
    <Link
      to="/tokens/$tokenId"
      params={{ tokenId: token.response.tokenid }}
      className={`${cardClasses} cursor-pointer`}
    >
      {CardContent}
    </Link>
  ) : (
    <div className={`${cardClasses} w-full`}>{CardContent}</div>
  )
}

interface CoinCardProps {
  coin: Coin
  isSelected: boolean
  onSelect: (id: string) => void
  disabled?: boolean
  selectedCount: number
  selectedCoinIds: string[]
  closeActionBar: () => void
  setSelectedTokens: (ids: string[]) => void
}

export const CoinCard = ({
  coin,
  isSelected,
  onSelect,
  disabled,
  selectedCount,
  selectedCoinIds,
  closeActionBar,
  setSelectedTokens,
}: CoinCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      !(e.target instanceof HTMLButtonElement) &&
      !(e.target instanceof HTMLInputElement)
    ) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleConsolidateClick = () => {
    closeActionBar()
  }

  return (
    <>
      <div
        className={`flex flex-col bg-card rounded-lg shadow transition-all duration-300 ease-in-out hover:bg-card/80 hover:shadow-md cursor-pointer ${
          disabled ? "opacity-50" : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Checkbox
              disabled={disabled}
              id={`token-${coin.coinid}`}
              checked={isSelected}
              onCheckedChange={() => {
                onSelect(coin.coinid)
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
            <Coins className="h-6 w-6 text-primary" />

            {coin.miniaddress ? (
              <span className="font-medium dark:bg-[#18181b] bg-[#dcfce7] text-[#116932] py-[2px] px-1 mr-1 text-xs">
                Sendable
              </span>
            ) : (
              <span className="font-medium dark:bg-[#18181b] bg-[#f4f4f5] text-primary py-[2px] px-1 mr-1 text-xs">
                Locked
              </span>
            )}

            {coin.created === "0" ? (
              <span
                className={cn(
                  "font-medium text-primary py-[2px] px-2 mr-1",
                  "animate-pulse bg-yellow-100 text-yellow-600"
                )}
              >
                Pending
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-xs">
              Amount: {Number(coin.tokenamount).toFixed(2)}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0 w-fit hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-4 pb-4 pt-2 border-t border-border">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium bg-[#f4f4f5] dark:bg-[#18181b] text-primary py-[2px] px-2 mr-1">
                      Coin ID:
                    </span>
                    <span className="font-mono truncate">{coin.coinid}</span>
                  </div>
                  {coin.address && (
                    <div className="flex justify-between">
                      <span className="font-medium bg-[#f4f4f5] dark:bg-[#18181b] text-primary py-[2px] px-2 mr-1">
                        Address:
                      </span>
                      <span className="font-mono truncate">{coin.address}</span>
                    </div>
                  )}
                  {coin.tokenid && (
                    <div className="flex justify-between">
                      <span className="font-medium bg-[#f4f4f5] dark:bg-[#18181b] text-primary py-[2px] px-2 mr-1">
                        Token ID:
                      </span>
                      <span className="font-mono truncate">{coin.tokenid}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium bg-[#f4f4f5] dark:bg-[#18181b] text-primary py-[2px] px-2 mr-1">
                      Created:
                    </span>
                    <span>Block {coin.created}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ActionBarRoot
        open={isSelected}
        onOpenChange={(e) => onSelect(e.open ? coin.coinid : "")}
        closeOnInteractOutside={false}
      >
        <ActionBarContent>
          <ActionBarSelectionTrigger className="text-sm">
            {selectedCount} Coins selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <ManualConsolidationDialog
            coinIds={selectedCoinIds}
            onConsolidate={handleConsolidateClick}
          />

          <ActionBarCloseTrigger onClick={() => setSelectedTokens([])} />
        </ActionBarContent>
      </ActionBarRoot>
    </>
  )
}
