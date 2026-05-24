import { useEffect } from "react";
import "./app.scss";
import { initWeappCloud } from "./utils/cloudAssets";
import { loadMiniProgramFonts } from "./utils/fontLoader";

function App({ children }) {
  useEffect(() => {
    if (process.env.TARO_ENV === "weapp") {
      initWeappCloud();
      loadMiniProgramFonts();
    } else if (process.env.TARO_ENV === "h5") {
      // Separate module so weapp builds do not bundle local font files.
      require("./utils/fontLoader.h5").loadH5Fonts();
    }
  }, []);

  return children;
}

export default App;
