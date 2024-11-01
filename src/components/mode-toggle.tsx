"use client"
import { Moon, Sun } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { useTheme } from "./theme-provider"

export default function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Toggle
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      pressed={theme === "dark"}
      onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
      )}
      <span className="sr-only">
        {theme === "dark" ? "Dark" : "Light"} mode
      </span>
    </Toggle>
  )
}
