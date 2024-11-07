import { MDS } from "@minima-global/mds"
import { createContext, useRef, useEffect, useState } from "react"

type ContextType = {
  isInited: boolean
}

export const appContext = createContext<ContextType>({
  isInited: false,
})

interface IProps {
  children: React.ReactNode
}

const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false)
  const [isInited, setIsInited] = useState(false)

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true

      MDS.init(async ({ event }) => {
        if (event === "inited") {
          setIsInited(true)
          MDS.log("MDS INITED AND READY 🚀")
        }
      })
    }
  }, [loaded, isInited])

  return (
    <appContext.Provider
      value={{
        isInited,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export default AppProvider
