import configuration from "config";
import { globSync } from "glob";
import path from "path";
import webpack from "webpack";

interface WebpackConfig {
  outputDir: string;
}

const webpackConfig = configuration.get<WebpackConfig>("webpack");
const outputDir = webpackConfig.outputDir;

const config: webpack.Configuration = {
  mode: "production",
  entry: globSync("./src/*.ts").reduce((acc, file) => {
    const baseName = path.basename(file, ".ts");
    return { ...acc, [baseName]: path.resolve(__dirname, file) };
  }, {}),
  target: "node",
  output: {
    filename: "[name].js",
    library: {
      type: "commonjs",
    },
    path: path.resolve(__dirname, outputDir),
  },
  optimization: {
    // We do not want to minimize our code.
    minimize: false,
    moduleIds: "named",
  },
  module: {
    rules: [
      {
        test: /\.[tj]s(on)?$/,
        use: {
          loader: "ts-loader",
          options: {
            allowTsInNodeModules: true,
            transpileOnly: true,
            compilerOptions: {
              ignoreDeprecations: "6.0",
              rootDir: "./",
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      lib: path.resolve(__dirname, "./lib/"),
    },
  },
  externals: {
    "lib/lodash": "commonjs lib/lodash",
  },
};

export default config;
