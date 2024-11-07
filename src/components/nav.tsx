import { motion } from "framer-motion"

import { useRef } from "react"

interface NavProps {
  activeTab: "consolidate" | "split"
  setActiveTab: (tab: "consolidate" | "split") => void
  setHoveredLink: (link: "consolidate" | "split" | null) => void
  hoveredLink: "consolidate" | "split" | null
}

export const Nav = ({
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
