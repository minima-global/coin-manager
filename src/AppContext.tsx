import { MDS } from "@minima-global/mds"
import { useQueryClient } from "@tanstack/react-query"
import { createContext, useRef, useEffect, useState } from "react"

type ContextType = {
  isInited: boolean
  mdsEventData: any
  topBlock: string
}

export const appContext = createContext<ContextType>({
  isInited: false,
  mdsEventData: null,
  topBlock: "",
})

interface IProps {
  children: React.ReactNode
}

const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false)
  const [isInited, setIsInited] = useState(false)
  const [mdsEventData, setMdsEventData] = useState<any>(null)
  const [topBlock, setTopBlock] = useState<string>("")
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true

      MDS.init(async ({ event, data }) => {
        if (event === "inited") {
          setIsInited(true)
          MDS.log("MDS INITED AND READY 🚀")
          const topBlock = await MDS.cmd.block()
          setTopBlock(topBlock.response.block)

          // @ts-ignore TODO: Fix this
        } else if (event === "MDS_PENDING") {
          setMdsEventData(data)
          console.log("MDS PENDING", data)
          queryClient.invalidateQueries()
        } else if (event === "NEWBLOCK") {
          // @ts-ignore TODO: Fix this
          setTopBlock(data.txpow.header.block)
        }
      })
    }
  }, [loaded, isInited])

  return (
    <appContext.Provider
      value={{
        isInited,
        mdsEventData,
        topBlock,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export default AppProvider
