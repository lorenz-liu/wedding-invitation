import path from "node:path";
import type { UserConfigExport } from "@tarojs/cli";

// TARO_ENV is not set when this config file is first loaded; read --type from argv.
function getBuildType(): string | undefined {
  const typeIndex = process.argv.indexOf("--type");
  if (typeIndex !== -1) return process.argv[typeIndex + 1];
  return process.env.TARO_ENV;
}

// Weapp uses Aliyun OSS; H5 copies local assets when FC URL is not configured.
const assetCopyPatterns =
  getBuildType() === "weapp" ? [] : require("../scripts/asset-copy-patterns");

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
    patterns: assetCopyPatterns,
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
