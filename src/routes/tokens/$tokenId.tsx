import {
  ConsolidationDialog,
  ManualConsolidationDialog,
} from "@/components/dialogs/consolidation-dialog"
import {
  CoinCard,
  MinimaTokenCard,
  TokenCard,
} from "@/components/tokens/token-card"
import { useMinima } from "@/hooks/use-minima"
import { CoinsResponse } from "@minima-global/mds"
import { createFileRoute } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { SplitDialog } from "@/components/tokens/split"
import { InfoIcon } from "lucide-react"
import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar"
import { Nav } from "@/components/nav"

export const Route = createFileRoute("/tokens/$tokenId")({
  component: Tokens,
})

function Tokens() {
  const { tokenId } = Route.useParams()
  const { tokenById, coinsByTokenId, balanceByTokenIdQuery } = useMinima()
  const { data: token } = tokenById(tokenId)
  const { data: coins } = coinsByTokenId(tokenId)
  const { data: balance } = balanceByTokenIdQuery(tokenId)
  const [activeTab, setActiveTab] = useState<"consolidate" | "split">(
    "consolidate"
  )
  const [hoveredLink, setHoveredLink] = useState<
    "consolidate" | "split" | null
  >(null)

  if (!token || !coins || !balance) return null

  return (
    <div className="container mx-auto max-w-2xl flex flex-col gap-4">
      {tokenId !== "0x00" ? (
        <TokenCard
          token={token}
          isLinkEnabled={false}
          type="showcase"
          totalCoins={coins?.response.length}
          balance={balance}
        />
      ) : (
        <MinimaTokenCard token={balance} type="showcase" />
      )}

      <Nav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setHoveredLink={setHoveredLink}
        hoveredLink={hoveredLink}
      />

      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "consolidate" && (
            <motion.div
              key="consolidate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full"
            >
              <ConsolidateCoins
                coins={coins}
                disabled={coins.response.length < 3}
              />
            </motion.div>
          )}
          {activeTab === "split" && (
            <motion.div
              key="split"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full"
            >
              <SplitCoins />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface ConsolidateProps {
  coins: CoinsResponse
  disabled: boolean
}

const ConsolidateCoins = ({ coins, disabled }: ConsolidateProps) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

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
      <div className="flex flex-col gap-1 ">
        <h1 className="text-base">Auto Consolidation</h1>
        <p className="text-sm text-muted-foreground">
          Consolidate your coins automatically
        </p>
        <span className="text-xs text-muted-foreground -mt-1">
          (Must have at least 3 coins)
        </span>
      </div>
      <ConsolidationDialog disabled={coins.response.length < 3} />

      <div className="flex items-center gap-2">
        <div className="w-full h-[1px] bg-border" />
        <p className="text-sm text-muted-foreground">Or</p>
        <div className="w-full h-[1px] bg-border" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-base">Manual Consolidation</h1>
        <p className="text-sm text-muted-foreground">
          Select coins to consolidate
        </p>
        <span className="text-xs text-muted-foreground -mt-1">
          (Must have at least 3 coins)
        </span>
      </div>

      {coins?.response.map((coin) => (
        <CoinCard
          key={coin.coinid}
          coin={coin}
          isSelected={selectedTokens.includes(coin.coinid)}
          onSelect={handleTokenSelect}
          disabled={disabled}
        />
      ))}

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
          <ActionBarSelectionTrigger className="text-sm">
            {selectedTokens.length} Coins selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <ManualConsolidationDialog
            coinIds={selectedTokens}
            onConsolidate={closeActionBar}
          />
          <ActionBarCloseTrigger onClick={() => setSelectedTokens([])} />
        </ActionBarContent>
      </ActionBarRoot>
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
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <InfoIcon className="w-4 h-4 text-blue-700" />
          Generating an address uses one of your 64 addresses
        </p>
      </div>
      <SplitDialog />
    </div>
  )
}
