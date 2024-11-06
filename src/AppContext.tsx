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

          const createTable = await MDS.sql(
            "CREATE TABLE IF NOT EXISTS CONSOLIDATION (id bigint auto_increment PRIMARY KEY, pending_id varchar(256), txn_id varchar(256), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
          )
          console.log(createTable)

          const select = await MDS.sql("SELECT * FROM CONSOLIDATION")

          console.log(select)
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
