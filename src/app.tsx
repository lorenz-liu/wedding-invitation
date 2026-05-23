import { useEffect } from "react";
import "./app.scss";
import { loadMiniProgramFonts, loadH5Fonts } from "./utils/fontLoader";

function App({ children }) {
  useEffect(() => {
    // Load fonts dynamically to avoid WXSS size issues
    if (process.env.TARO_ENV === "weapp") {
      loadMiniProgramFonts();
    } else {
      loadH5Fonts();
    }
  }, []);

  return children;
}

export default App;
