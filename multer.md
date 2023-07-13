======
Multer : multipart/form-data를 처리하기 위한 node.js 미들웨어
======

[NPM] (https://github.com/expressjs/multer/blob/master/doc/README-ko.md)

# 1. 설치

> npm install --save multer

# 2. 사용 (단일 파일)

미들웨어 이므로 router 에서 사용.

    1. 라우터
        > app.post('/profile', multer객체.single('avatar'), controller)

    2. 컨트롤러
        > const { path } = req.file // 업로드된 파일의 전체 경로

# 3. 사용 (복수 파일)

미들웨어 이므로 router 에서 사용.

    1. 라우터
        > app.post('/profile', multer객체.fleids('avatar', 'thumbnail'), controller)

    2. 컨트롤러
        > const { avatar, thumbnail } = req.files;