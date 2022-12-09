#Spring, Django, Express 유저-게시판-댓글(사진 게시 가능) 프로젝트
#첫번째, Express

## 유저는 여러개의 게시글을 쓸 수있고, 게시글엔 여러개의 댓글이 달릴 수 있다.
## 게시글과 댓글 모두 사진과 글을 게시할 수 있고, 사진은 옵션이며 글은 필수이다.
## 사진의 경우 게시글은 최대 4개, 댓글은 최대 1개 게시가 가능하게끔 구현한다.

- 메서드 네이밍
    - GET -> get___
    - POST -> create___
    - PATCH,PUT -> update___
    - DELETE -> delete___

- 기능 구현 목록
    - 유저
        - /users
            - GET
                - 모든 유저 조회
            - POST
                - 유저 생성(가입)
        - /users/{user_id}
            - GET
                - user_id 유저 조회
            - PATCH
                - user_id 유저 정보 업데이트
            - DELETE
                - user_id 유저 삭제
    - 게시판
        - /articles
            - GET
                - 작성된 모든 게시글 조회.
        - /users/{user_id}/articles
            - GET
                - user_id 유저의 모든 게시글 조회
            - POST
                - user_id 유저의 게시글 생성
        - /users/{user_id}/articles/{article_id}
            - PATCH
                - user_id 유저의 article_id 게시글 수정
            - DELETE
                - user_id 유저의 article_id 게시글 삭제
        - /articles/{article_id}
            - GET
                - article_id 게시글 조회 (유저가 아니더라도 조회 가능)
    - 댓글
        - /users/{user_id}/articles/{article_id}/comments
            - POST
                - article_id 게시글에 user_id 유저가 댓글 작성
                    - articles.user_id 와 parameter의 user_id는 같아도, 안같아도 됨.
        - articles/{article_id}/comments
            - GET
                - article_id 게시글에 달린 모든 댓글 조회
        - /users/{user_id}/articles/{article_id}/comments/{comment_id}
            - PATCH
                - article_id 게시글의 comment_id 댓글에 대해 수정
                - 이 경우, comment_id의 user_id == parameter user_id
            - DELETE
                - article_id 게시글의 comment_id 댓글 삭제
                - 이 경우도 comment_id.user_id == req.params.user_id
        - /users/{user_id}/comments
            - GET
                - 게시글에 상관없이, user_id 유저가 작성한 단 댓글들 조회
        
    

- 테스트 구현 목록
    - 각 REST API에 대해, HTTP Response가 제대로 왔는지
    - 해당 Response에 대한 data mapping이 잘 되었는지
    - Test Coverage 100%가 목표.