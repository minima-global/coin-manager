import { useEffect, useState } from "react";

export const useAndroidShowTitleBar = () => {
  const [isMinimaBrowser, setIsMinimaBrowser] = useState(false);

  const openTitleBar = () => {
    if (!isMinimaBrowser) return;
    // @ts-ignore
    window.Android.showTitleBar();
  };

  useEffect(() => {
    if (window.navigator.userAgent.includes("Minima Browser")) {
      setIsMinimaBrowser(true);
    }
  }, []);

  return { openTitleBar, isMinimaBrowser };
};

export default useAndroidShowTitleBar;
