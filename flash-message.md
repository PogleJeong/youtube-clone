======
Flash-Message
======

[npm] (https://www.npmjs.com/package/express-flash)

npm i express-flash

# Express Flash

Express 애플리케이션용 플래시 메시지
플래시는 플래시 메시지를 정의하고 요청을 리디렉션하지 않고 렌더링할 수 있는 기능이 있는 connect-flash의 확장.

server 에 사용

# 1. 사용

> server
>> import flash from "express-flash";
   app.use(flash());
   app.use(flash()); 를 통해 req.flash 사용가능.

> middleware
>> req.flash("error", "Not authorized")

> view, controller
>> controller 에서 req.flash("error", "not allowed") 로 사용하면
>> res.locals.messages 에 변수로 담김.
>>> view 에서 messages.error 로 출력가능.