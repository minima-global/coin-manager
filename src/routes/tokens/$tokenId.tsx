import { ConsolidationDialog } from "@/components/dialogs/consolidation-dialog"
import { CoinCard, TokenCard } from "@/components/ui/token-card"
import { useMinima } from "@/hooks/use-minima"
import { CoinsResponse } from "@minima-global/mds"
import { createFileRoute } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"

export const Route = createFileRoute("/tokens/$tokenId")({
  component: TokenComponent,
})

function TokenComponent() {
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

  if (!token || !coins) return null

  return (
    <div className="container mx-auto max-w-2xl flex flex-col gap-4">
      <TokenCard
        token={token}
        isLinkEnabled={false}
        type="showcase"
        totalCoins={coins?.response.length}
        balance={balance}
      />

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
              <Consolidate coins={coins} disabled={coins.response.length < 3} />
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
              <div>Split content here</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface NavProps {
  activeTab: "consolidate" | "split"
  setActiveTab: (tab: "consolidate" | "split") => void
  setHoveredLink: (link: "consolidate" | "split" | null) => void
  hoveredLink: "consolidate" | "split" | null
}

const Nav = ({
  activeTab,
  setActiveTab,
  setHoveredLink,
  hoveredLink,
}: NavProps) => {
  const previousLink = useRef<"consolidate" | "split" | null>(null)

  const handleMouseEnter = (link: "consolidate" | "split") => {
    previousLink.current = hoveredLink
    setHoveredLink(link)
  }

  const handleMouseLeave = () => {
    previousLink.current = hoveredLink
    setHoveredLink(null)
  }

  return (
    <div className="border-b border-muted mt-4 pb-2 w-full">
      <div className="container mx-auto max-w-2xl">
        <div className="flex w-64 gap-4 relative">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 rounded bg-[#ebebeb] dark:bg-[#27272a]"
            animate={{
              x:
                hoveredLink === "consolidate"
                  ? 0
                  : hoveredLink === "split"
                    ? "calc(100% + 16px)"
                    : previousLink.current === "split"
                      ? "calc(100% + 16px)"
                      : 0,
              opacity: hoveredLink ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              x: { type: previousLink.current ? "spring" : "tween" },
            }}
            style={{ width: "calc(50% - 8px)" }}
          />

          {/* Active tab indicator */}
          <motion.div
            className="absolute h-[2px] bottom-[-9px] bg-foreground"
            animate={{
              x: activeTab === "split" ? "calc(100% + 16px)" : 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            style={{ width: "calc(50% - 8px)" }}
          />

          {/* Consolidate button */}
          <div
            className="relative p-2 rounded-lg transition-all duration-300 ease-in-out group flex-1 text-center"
            onMouseEnter={() => handleMouseEnter("consolidate")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveTab("consolidate")}
              className={`${
                activeTab === "consolidate"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              } group-hover:text-foreground relative z-10 block text-sm w-full`}
            >
              Consolidate
            </button>
          </div>

          {/* Split button */}
          <div
            className="relative p-2 rounded-lg transition-all duration-300 ease-in-out group flex-1 text-center"
            onMouseEnter={() => handleMouseEnter("split")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveTab("split")}
              className={`${
                activeTab === "split"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              } group-hover:text-foreground relative z-10 block text-sm w-full`}
            >
              Split
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ConsolidateProps {
  coins: CoinsResponse
  disabled: boolean
}

const Consolidate = ({ coins, disabled }: ConsolidateProps) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

  const handleTokenSelect = (coinId: string) => {
    setSelectedTokens((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    )
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
    </div>
  )
}
