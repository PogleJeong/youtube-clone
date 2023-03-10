const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

module.exports = {
  entry: {
    main:"./src/client/js/main.js", 
    videoPlayer: "./src/client/js/videoPlayer.js"
  },
  mode: "development",

  watch: true, // 자동으로 변경사항 실행. (npm run assets)

  plugins: [
    new MiniCssExtractPlugin({
    filename: "css/styles.css", // 변환한 css 파일 저장위치 및 이름
    }),
  ],

  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"), // 변환한 js 파일을 저장할 장소
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, //js 파일 모두 변환
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/, //scss 파일 모두 변환
        //MiniCssExtractPlugin : CSS를 별도의 파일로 분리하는 플러그인
        //style-loader : css를 DOM 에 주입 (MiniCss~ 가 대체)
        //css-loader : @import, url 해석
        //sass-loader : sass 파일을 일반 css 로 변환
        use: [MiniCssExtractPlugin, "css-loader", "sass-loader"], // 역순으로 실행함.
      },
    ],
  },
};