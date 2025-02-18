import { motion } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";

interface NavProps {
  activeTab: "auto" | "manual" | "total" | "perCoin" | "custom" | null;
  setActiveTab: (
    tab: "auto" | "manual" | "total" | "perCoin" | "custom"
  ) => void;
  setHoveredLink: (
    link: "auto" | "manual" | "total" | "perCoin" | "custom" | null
  ) => void;
  hoveredLink: "auto" | "manual" | "total" | "perCoin" | "custom" | null;
  mode?: "consolidate" | "split";
}

const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

export const Nav = ({
  activeTab,
  setActiveTab,
  setHoveredLink,
  hoveredLink,
  mode = "consolidate",
}: NavProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousLink = useRef<
    "auto" | "manual" | "total" | "perCoin" | "custom" | null
  >(null);

  const handleMouseEnter = (
    link: "auto" | "manual" | "total" | "perCoin" | "custom"
  ) => {
    previousLink.current = hoveredLink;
    setHoveredLink(link);
  };

  const handleMouseLeave = () => {
    previousLink.current = hoveredLink;
    setHoveredLink(null);
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const tabs =
    mode === "consolidate"
      ? [
          { id: "auto" as const, label: "Auto" },
          { id: "manual" as const, label: "Manual" },
        ]
      : [
          { id: "total" as const, label: "Split Total Amount" },
          { id: "perCoin" as const, label: "Split by Amount" },
          { id: "custom" as const, label: "Custom Split" },
        ];

  const getOffset = (index: number) => {
    if (mode === "split") {
      return `calc(${index} * (33.333% + 146px))`;
    }
    return `${index * 100 + index * 16}%`;
  };

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  return (
    <div
      ref={scrollRef}
      className="border-b border-muted mt-4 pb-2 w-full overflow-x-auto overflow-y-hidden scrollbar-hide md:cursor-default cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <div className="container mx-auto max-w-2xl">
        <div
          className={`flex ${
            mode === "split" ? "min-w-[600px] md:min-w-0 md:w-full" : "w-64"
          } gap-4 relative `}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 rounded bg-[#ebebeb] dark:bg-[#27272a]"
            animate={{
              x: hoveredLink
                ? getOffset(tabs.findIndex((tab) => tab.id === hoveredLink))
                : "0",
              opacity: hoveredLink ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              x: { type: previousLink.current ? "spring" : "tween" },
            }}
            style={{
              width:
                mode === "split" ? "calc(33.333% - 11px)" : "calc(50% - 8px)",
            }}
          />

          {/* Active tab indicator */}
          <motion.div
            className="absolute h-[2px] bottom-[-9px] bg-lightOrange"
            animate={{
              x: getOffset(tabs.findIndex((tab) => tab.id === activeTab)),
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            style={{
              width:
                mode === "split" ? "calc(33.333% - 11px)" : "calc(50% - 8px)",
            }}
          />

          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="relative p-2 rounded-lg transition-all duration-300 ease-in-out group flex-1 text-center"
              onMouseEnter={() => handleMouseEnter(tab.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "font-medium text-lightOrange"
                    : "text-muted-foreground"
                } group-hover:text-lightOrange relative z-10 block text-sm w-full`}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
