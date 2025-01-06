import { useQueryState } from "nuqs"
import { ManualConsolidationDialog } from "@/components/dialogs/consolidation-dialog"
import { CoinCard, TokenCard } from "@/components/tokens/token-card"
import { useMinima } from "@/hooks/use-minima"
import { createFileRoute } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeftIcon } from "lucide-react"
import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarRoot,
} from "@/components/ui/action-bar"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { ConsolidationContent } from "@/components/tokens/consolidation-content"
import { useState } from "react"
import { Split } from "@/components/tokens/split"
import { MDSResponse } from "@minima-global/mds"
import { Coin } from "@minima-global/mds"

type TabValue = "consolidate" | "split" | null

export const Route = createFileRoute("/tokens/$tokenId")({
  component: Tokens,
})

function Tokens() {
  const { tokenId } = Route.useParams()
  const { coinsByTokenId, balanceByTokenIdQuery } = useMinima()
  const { data: coins } = coinsByTokenId(tokenId)
  const { data: balance } = balanceByTokenIdQuery(tokenId)

  const [activeTab, setActiveTab] = useQueryState<TabValue>("tab", {
    defaultValue: null,
    parse: (value) => {
      if (value === "consolidate" || value === "split") return value
      return null
    },
    serialize: (value) => value || "",
  })

  if (!coins || !balance) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div className="relative">
        {activeTab !== null ? (
          <div className="flex flex-col gap-4 mb-4">
            <Button
              onClick={() => setActiveTab(null)}
              variant="ghost"
              className="p-0 w-fit hover:bg-transparent"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </Button>
          </div>
        ) : null}

        <div className="container mx-auto max-w-2xl flex flex-col gap-4">
          <TokenCard
            token={balance}
            isLinkEnabled={false}
            type="showcase"
            totalCoins={coins?.response.length}
            balance={balance.response}
            tab={activeTab}
          />

          <AnimatePresence mode="wait">
            {activeTab === null && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col mt-5 gap-4"
              >
                <h1 className="text-base">Manage</h1>
                <div className="flex flex-col md:flex-row py-8 px-6 bg-grey10 dark:bg-darkContrast md:items-center justify-center gap-10 mt-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-[22px] font-medium">
                      Consolidate your coins
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Combines multiple small coins into larger ones. This is
                      essential for preventing “dust” - lots of tiny coins that
                      clutter your wallet.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("consolidate")}
                    variant="outline"
                    className="bg-lightOrange text-black p-0 px-8 py-4  hover:bg-lighterOrange transition-all duration-300 ease-in-out hover:text-black min-w-[156px]"
                  >
                    Consolidate
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row py-8 px-6 bg-grey10 dark:bg-darkContrast md:items-center justify-center gap-10 mt-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-[22px] font-medium">
                      Split your coins
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Break down larger coins into smaller amounts. This ensures
                      you have multiple coins available for transactions
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("split")}
                    variant="outline"
                    className="bg-lightOrange text-black p-0 px-8 py-4  hover:bg-lighterOrange transition-all duration-300 ease-in-out hover:text-black min-w-[156px]"
                  >
                    Split
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "consolidate" && (
              <motion.div
                key="consolidate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="w-full">
                  <ConsolidateCoins
                    coins={coins}
                    disabled={coins.response.length < 3}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "split" && (
              <motion.div
                key="split"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <SplitCoins />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

interface ConsolidateProps {
  coins: MDSResponse<Coin[]>
  disabled: boolean
}

const ConsolidateCoins = ({ coins, disabled }: ConsolidateProps) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<
    "auto" | "manual" | "total" | "perCoin" | "custom" | null
  >("auto")
  const [hoveredLink, setHoveredLink] = useState<
    "auto" | "manual" | "total" | "perCoin" | "custom" | null
  >(null)

  const handleTokenSelect = (coinId: string) => {
    setSelectedTokens((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    )
  }

  const closeActionBar = () => {
    setSelectedTokens([])
  }

  return (
    <div className="container mx-auto  max-w-2xl flex flex-col gap-4 pb-20">
      <Nav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setHoveredLink={setHoveredLink}
        hoveredLink={hoveredLink}
      />

      {activeTab === "auto" ? (
        <>
          <div className="flex flex-col gap-1 ">
            <h1 className="text-base">Auto Consolidation</h1>
            <p className="text-sm text-muted-foreground">
              Consolidate your coins automatically
            </p>
            <span className="text-xs text-muted-foreground -mt-1">
              (Must have at least 3 coins)
            </span>
          </div>
          <ConsolidationContent />
        </>
      ) : activeTab === "manual" ? (
        <AnimatePresence>
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-base">Manual Consolidation</h1>
              <p className="text-sm text-muted-foreground">
                Select coins to consolidate
              </p>
              <span className="text-xs text-muted-foreground -mt-1">
                (Must have at least 3 coins)
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {coins?.response.map((coin) => (
                <CoinCard
                  key={coin.coinid}
                  coin={coin}
                  isSelected={selectedTokens.includes(coin.coinid)}
                  onSelect={handleTokenSelect}
                  disabled={disabled}
                />
              ))}
            </div>
            <ActionBarRoot
              open={selectedTokens.length > 0}
              onOpenChange={(e) => {
                if (!e.open) {
                  setSelectedTokens([])
                }
              }}
              closeOnInteractOutside={false}
            >
              <ActionBarContent>
                <ManualConsolidationDialog
                  coinIds={selectedTokens}
                  onConsolidate={closeActionBar}
                />
                <ActionBarCloseTrigger onClick={() => setSelectedTokens([])} />
              </ActionBarContent>
            </ActionBarRoot>
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  )
}

const SplitCoins = () => {
  return (
    <div className="container mx-auto max-w-2xl flex flex-col gap-4 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-base">Split Coins</h1>
        <p className="text-sm text-muted-foreground">
          Split your coins into smaller amounts
        </p>
      </div>
      <Split />
    </div>
  )
}
