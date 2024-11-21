import { useEffect, useState } from "react"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem("hasSeenSplash")
  })

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false)
        localStorage.setItem("hasSeenSplash", "true")
      }, 3000)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999] flex-col gap-4 top-20">
      <img
        src="./assets/coinmanager.gif"
        alt=""
        height={200}
        width={200}
        className="invert dark:invert-0"
      />
      <h1 className="text-primary text-2xl font-bold">Minima Coin Manager</h1>
      <span className="text-muted-foreground text-sm">Version 0.3.0</span>
    </div>
  )
}
