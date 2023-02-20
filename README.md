# youtube reloaced
[URL -> operation] 

[global router - 홈에서 바로 ]
/ -> Home
/join -> Join
/login -> Login
/search -> Search

[users router]
/users/:id -> See User
/users/edit -> Edit My Profile
/users/delete -. Delete My Profile

[videos router]
/videos/:id -> Watch Video
/users/logout -> Log out
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video
/videos/:id/upload -> Upload Video
/videos/comments -> Comment on a video
/videos/comments/delete -> Delete a commnent of a Video






라우터를 도메인 별로 나누는 작업!!, url 이 어떻게 시작하는지에 따라 나누는 방법으로 라우터는 우리가 작업중인 주제를 기반으로 URL을 그룹화 해준다!!
규칙을 따르는 게 좋지만, 가끔은 마케팅이나 간소화를 위해서 예외를 두어도 괜찮다

Planing Routes 를 위해서 유저의 관점에서 생각하면 된다.