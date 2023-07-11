======
Webpack
======

# 1. Introduce

[webpack](https://webpack.kr/)

Webpack 은 Open source JS module bundler 이다. 
Webpack 은 frontend 기술에 있어서 업계표준으로 사용되고 있으며, Frontend developer 라면 webpack 에 대한 지식이 요구될 정도로 이해가 필요하다.

Webpack 을 설치하기 위해선 Node.js가 필요하다.

    bundler : 여러개로 모듈화된 JS 파일을 하나로 합치는 도구로, 브라우저는 모듈화된 자바스크립트를 읽지 못하기 때문에 반드시 번들러가 필요함.

SCSS 경우 Webpack 이 없다면 브라우저가 이해할 수 없기에 적용할 수 없다. 브라우저는 기본적으로 
HTML, CSS 등 을 인식할 수 있지만, SCSS 와 같은 개발자에게 유용한 기능을 하는 확장모듈을 브라우저에 적용할 수 없다. Webpack 은 우리가 작성한 SCSS 파일을 일반 CSS 로 변환하는 작업등을 한다.

브라우저에게 개발자에게 유용한 확장모듈, 언어 등을 적용할 수 있도록 Webpack 을 설정해야한다.

지금까지 사용한 Babel 은 Backend 에서 Node.js 에게 우리가 작성한 최신문법 등을 브라우저 친화적이게 바꿔주는 작업을 하고

Webpack 은 Frontend 에서 브라우저에게 우리가 작성한 최신문법, 확장모듈 등을 브라우저 친화적이게 바꿔주는 작업을 한다. 

- 일반적으로 webpack.config.js 로 작성을 한다.
- vue, react 등 프레임워크에서는 webpack 이 기본적으로 설정되있으므로 수정할 일이 드물다.
- 하지만 업계표준으로써 한번쯤 작성을 해봐야한다.

# 2. 사용

1. 설치

    1. npm i webpack webpack-cli --save-dev
    2. webpack.config.js 파일 생성 및 작성

2. 작성 및 구성

    1. module.export = {}
    > export default const ~ 의 구식버전이라고 생각하면 된다.

    2. Entry
    > 우리가 Webpack 으로 보내 처리하고자하는, 우리가 작성한 파일들을 가르킨다.
    > property 에 우리가 작성한 파일, Webpack 에 적용할 파일 경로를 입력한다.
    >> 여러 파일들을 다음과 같이 입력할 수 있다.
    >> entry: {
        main: "~~.js",
        sub: "~~.js",
    }

    3. Output
    > 처리된 결과물에 대한 정보, filename, path 작성 필요
    > output 예시: output: { 
        filename: "output.js", 
        path: path: path.resolve(__dirname, "assets", "js"), -- 절대경로
        clean: true,  -- output folder를 빌드하기전에 clean 작업함.
    }
    >> output: {
        filename: "js/[name].js, 를 통해 entry 변수를 적용할 수 있다. 
    }

    4. package.json 에서 script 추가 작성
    > 예시 "scripts": {
        "dev:asset": "webpack --config webpack.config.js"
    },

    5. module
    > 변환한 모듈에 대한 규칙(rule) 설정
    > module: {
        rule: [
            {
                text: 정규식,       //적용할 파일이름 패턴
                use: {
                    loader: "적용할 loader - 다운필요",
                    option: {
                        적용할 options 
                    }
                }
            }
        ]
    }
    >> 필요한 loader 들을 npm 라이브러리로 설치.
    >> use: loaders... 는 역순으로 입력해야함

    6. mode
    > 결과물에 대한 모드 설정
    >> 완성한 결과물 = mode: "production"
    >> 개발중 = node: "development"

    7. watch : boolean
    > 초기 빌드 이후 webpack 에서 파일의 변경사항을 감시 및 추적

