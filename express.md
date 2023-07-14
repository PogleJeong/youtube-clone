# express


## express.text([options])

Express에 내장된 미들웨어 기능입니다.
body-parser를 기반으로 request payload로 전달한 문자열을 파싱합니다.

## express.json([options])

Express에 내장된 미들웨어 기능입니다.
body-parser를 기반으로 request payload로 전달한 JSON을 파싱합니다.
문자열을 받아서 json으로 바꿔줍니다.
주의할 점은 express.json()은 header에 Content-Type이 express.json()의 기본 값인 "application/json"과 일치하는 request만 보는 미들웨어를 반환합니다.
다시 말해, headers: { "Content-type": "application/json" }인 request만 express.json()을 실행한다.