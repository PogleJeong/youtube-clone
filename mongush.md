======
CMD - MongoDB shell
======

# 1. 실행
1. mongosh 로 실행
2. use "db명" 으로 DB 실행
3. db."model명".find() 등으로 데이터 조회가능
4. db."model명".remove({}) 등으로 데이터 전체삭제가능

# 2. DB 명령어

use (DB명) - 해당 이름의 DB를 실행하거나 없으면 생성.

show dbs - 현재 생성되어있는 DB 출력

db - 현재 실행중인 DB 출력

db.stats() - 현재 실행중인 DB 상세출력.

db.dropDatabase() - 현재 실행중인 DB 삭제


# 2. Collection 명령어 - 스키마

db.createCollection("컬렉션명") - 해당 컬렉션 생성

show collections - Collection 조회

db.컬렉션명.drop()  - 해당 컬렉션 제거


# 3. Data 관련 명령어

db."컬렉션명".insert({})
db."컬렉션명".find() - 데이터 전체조회.
db."컬렉션명".find({"key":"value"}) - 데이터 상세 조회.
db.컬렉션명.remove({"key":"value"}) - 특정 데이터 삭제
