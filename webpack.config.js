const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js", // 우리가 처리하고 싶은 파일
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
    header: BASE_JS + "header.js",
    edit: BASE_JS + "edit.js",
  },
    mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "[name].js",  // [name] 을통해 entry 변수 사용가능
    path: path.resolve(__dirname, "assets", "js"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"], // 역순으로 실행됨.
      },
    ],
  },
};