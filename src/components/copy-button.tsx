import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, CircleCheck, CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  onCopy?: () => Promise<void>;
  label?: string;
  className?: string;
  showHint?: boolean;
}

export function CopyButton({
  onCopy,
  label = "Copy",
  className,
  showHint = false,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (onCopy) await onCopy();
      setIsCopied(true);
      toast.success("Copied to clipboard", {
        icon: <CircleCheck className="w-4 h-4" />,
      });
      setTimeout(() => setIsCopied(false), 4000);
    } catch (error) {
      setIsCopied(false);
    }
  };

  const button = (
    <Button
      variant="outline"
      onClick={handleCopy}
      className={cn(
        "h-auto px-5 transition-all duration-300",
        isCopied
          ? "bg-[#4FE3C1] hover:bg-[#4FE3C1] text-black hover:text-black"
          : "dark:bg-mediumDarkContrast bg-grey10 hover:bg-grey10",
        className
      )}
    >
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
          <CheckIcon />
        </motion.div>
      </motion.div>
    </Button>
  );

  if (showHint) {
    return <Hint label={label}>{button}</Hint>;
  }

  return button;
}
