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
    patterns: [
      // Fonts & music
      { from: "assets/fonts/", to: "dist/assets/fonts/" },
      { from: "assets/music/", to: "dist/assets/music/" },
      // Only copy images actually referenced in src/utils/assets.ts to keep
      // the WeChat mini-program package under its 2MB main-package limit.
      { from: "assets/images/homepage-niu.png", to: "dist/assets/images/homepage-niu.png" },
      { from: "assets/images/homepage-gao.png", to: "dist/assets/images/homepage-gao.png" },
      { from: "assets/images/logo-no-bg.png", to: "dist/assets/images/logo-no-bg.png" },
      { from: "assets/images/niu-kid-no-bg.png", to: "dist/assets/images/niu-kid-no-bg.png" },
      { from: "assets/images/gao-kid-no-bg.png", to: "dist/assets/images/gao-kid-no-bg.png" },
      { from: "assets/images/together-kids-no-bg.png", to: "dist/assets/images/together-kids-no-bg.png" },
      { from: "assets/images/sanya-no-bg.png", to: "dist/assets/images/sanya-no-bg.png" },
      { from: "assets/images/seattle-no-bg.png", to: "dist/assets/images/seattle-no-bg.png" },
      { from: "assets/images/together-2021-no-bg.png", to: "dist/assets/images/together-2021-no-bg.png" },
      { from: "assets/images/gao-undergrad-no-bg.png", to: "dist/assets/images/gao-undergrad-no-bg.png" },
      { from: "assets/images/niu-undergrad-no-bg.png", to: "dist/assets/images/niu-undergrad-no-bg.png" },
      { from: "assets/images/beijing.png", to: "dist/assets/images/beijing.png" },
      { from: "assets/images/shanghai.png", to: "dist/assets/images/shanghai.png" },
      { from: "assets/images/band.png", to: "dist/assets/images/band.png" },
      { from: "assets/images/seattle-4.png", to: "dist/assets/images/seattle-4.png" },
      { from: "assets/images/sanya.png", to: "dist/assets/images/sanya.png" },
      { from: "assets/images/toronto-no-bg.png", to: "dist/assets/images/toronto-no-bg.png" },
      { from: "assets/images/toronto-skyline.png", to: "dist/assets/images/toronto-skyline.png" },
      { from: "assets/images/holding-bawbaw-no-bg.png", to: "dist/assets/images/holding-bawbaw-no-bg.png" },
      { from: "assets/images/bawbaw-full-body-1.png", to: "dist/assets/images/bawbaw-full-body-1.png" },
      { from: "assets/images/bawbaw-full-body-3.png", to: "dist/assets/images/bawbaw-full-body-3.png" },
    ],
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
