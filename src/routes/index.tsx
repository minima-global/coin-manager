import { useMinima } from "@/hooks/use-minima"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: TokenManager,
})

import { useState } from "react"

import { ArrowUpDown, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TokenManager() {
  const { balance } = useMinima()
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

  const handleGroupTokens = () => {
    setSelectedTokens([])
  }

  return (
    <div className="container mx-auto  max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Tokens</h1>
      <div className="mb-8 p-6 bg-gradient-to-r from-primary/90 to-primary dark:from-primary/20 dark:to-primary/40 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg
              width="37"
              height="33"
              viewBox="0 0 37 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-primary-foreground dark:fill-primary"
            >
              <path d="M28.8727 9.20966L27.2806 16.2518L25.2445 7.7553L18.1105 4.86191L16.1816 13.3737L14.4823 3.39225L7.34831 0.51416L0 32.9998H7.79227L10.0427 23.0183L11.742 32.9998H19.5496L21.4632 24.488L23.4993 32.9998H31.2915L36.022 12.0877L28.8727 9.20966Z" />
            </svg>
            <div>
              <p className="text-primary-foreground dark:text-primary text-lg font-semibold">
                Total Balance
              </p>
              <p className="text-primary-foreground dark:text-primary text-3xl font-bold transition-all duration-500 ease-in-out">
                {balance?.response[0].confirmed.includes(".")
                  ? balance?.response[0].confirmed.split(".")[0] +
                    "." +
                    balance?.response[0].confirmed.split(".")[1].slice(0, 2)
                  : balance?.response[0].confirmed}
              </p>
            </div>
          </div>
          <ArrowUpDown className="h-8 w-8 text-primary-foreground dark:text-primary opacity-50" />
        </div>
      </div>
      <div className="grid gap-4">
        {balance?.response.map((token) => (
          <Link
            key={token.tokenid}
            to="/tokens/$tokenId"
            params={{ tokenId: token.tokenid }}
            className="flex items-center justify-between p-4 bg-card rounded-lg shadow transition-all duration-300 ease-in-out hover:bg-card/80 hover:shadow-md hover:scale-[1.02] cursor-pointer dark:shadow-muted"
          >
            <div className="flex items-center space-x-4">
              <Coins className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">
                  {typeof token.token === "string"
                    ? token.token
                    : token.token.name || "Unknown Token"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {typeof token.token === "string"
                    ? token.token
                    : token.token.name || "Unknown Token"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-medium">
                {token.confirmed.includes(".")
                  ? token.confirmed.split(".")[0] +
                    "." +
                    token.confirmed.split(".")[1].slice(0, 2)
                  : token.confirmed}
              </p>
              <Button variant="outline" size="sm" onClick={() => {}}>
                Manage
              </Button>
            </div>
          </Link>
        ))}
      </div>
      {selectedTokens.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleGroupTokens}>
            Group Selected Tokens ({selectedTokens.length})
          </Button>
        </div>
      )}
    </div>
  )
}
