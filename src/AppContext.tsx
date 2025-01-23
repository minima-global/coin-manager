import { MDS, MinimaEvents } from "@minima-global/mds";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useRef, useEffect, useState } from "react";

type ContextType = {
  isInited: boolean;
  mdsEventData: any;
  topBlock: string;
};

export const appContext = createContext<ContextType>({
  isInited: false,
  mdsEventData: null,
  topBlock: "",
});

interface IProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const [isInited, setIsInited] = useState(false);
  const [mdsEventData, setMdsEventData] = useState<any>(null);
  const [topBlock, setTopBlock] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;

      MDS.init(async ({ event, data }) => {
        if (event === MinimaEvents.INITED) {
          setIsInited(true);
          MDS.log("MDS INITED AND READY 🚀");
          const topBlock = await MDS.cmd.block();
          setTopBlock(topBlock.response.block);
        } else if (event === MinimaEvents.PENDING) {
          setMdsEventData(data);
          queryClient.invalidateQueries();
        } else if (event === MinimaEvents.NEWBLOCK) {
          setTopBlock(data.txpow.header.block);
        }
      });
    }
  }, [loaded, isInited]);

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
  );
};

export default AppProvider;
