import { useLaunch } from "@tarojs/taro";
import { useEffect } from "react";
import "./app.scss";
import { loadMiniProgramFonts } from "./utils/fontLoader";

function App({ children }) {
  useLaunch(async () => {
    if (process.env.TARO_ENV === "weapp") {
      try {
        await loadMiniProgramFonts();
      } catch (error) {
        console.error("[cdn] Failed to load fonts:", error);
      }
    }
  });

  useEffect(() => {
    if (process.env.TARO_ENV === "h5") {
      require("./utils/fontLoader.h5").loadH5Fonts();
    }
  }, []);

  return children;
}

export default App;
