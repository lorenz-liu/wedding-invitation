import path from "node:path";
import type { UserConfigExport } from "@tarojs/cli";

export default {
  projectName: "wedding-invitation",
  date: "2025-5-22",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: ["@tarojs/plugin-html"],
  defineConstants: {},
  alias: {
    "@assets": path.resolve(__dirname, "..", "assets"),
  },
  copy: {
    patterns: [{ from: "assets/", to: "dist/assets/" }],
    options: {},
  },
  framework: "react",
  compiler: "webpack5",
  cache: {
    enable: false,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    output: {
      filename: "js/[name].[hash:8].js",
      chunkFilename: "js/[name].[chunkhash:8].js",
    },
    router: {
      mode: "browser",
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: "module",
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  logger: {
    quiet: false,
    stats: true,
  },
} satisfies UserConfigExport<"webpack5">;
