# wanted-pre-onboarding-backend 사전과제
8월 7일부터 docker-compose 구현 예정

</br>

# 지원자의 성명

이경완
</br>

# 애플리케이션의 실행 방법 

1.의존성을 설치합니다
   
   ```
    yarn install
   ```
   
    
2. 환경 변수를 설정합니다. `.env` 파일을 생성하고 필요한 환경 변수를 입력합니다:

   ```
    DATABASE_URL="mysql://user:password@localhost:3306/dbname"
    JWT_SECRET="jwt_secret"
   ```
    
4. 데이터베이스를 초기화합니다:
    ```
    npx prisma migrate dev
    ```
    </br>
    
5. 서버를 실행합니다:
   ``` 
    yarn start
   ``` 
    
</br>

# 데이터베이스 테이블 구조
<img width="781" alt="스크린샷 2023-08-08 오전 11 20 08" src="https://github.com/gyungwan/wanted-pre-onboarding-backend/assets/113571059/9eb8254c-c7e5-4fc8-9ad4-e8f231c9e495">

</br>

# 구현한 API의 동작 영상 
https://youtu.be/4h8VnlgwLlg

</br>

# 구현 방법 및 이유에 대한 간략한 설명

#### prisma 사용 
  - Prisma는 타입 세이프한 쿼리 빌더로 데이터베이스 스키마와의 강력한 통합이 가능하다는 이유로 선택했습니다.

#### JWT 인증 방식 선택 
  - JWT는 토큰 기반의 인증 방식으로 서버에 상태를 유지하지 않아도 되며, 확장성이 용이하다는 이유로 선택했습니다.

#### 비밀번호 bcrypt
  - 강도 조절을 통해 비밀번호를 안전하게 저장하였고 해싱된 비밀번호를 검증하여 안전성을 높일 수 있어서 사용했습니다. 

#### validateUser middleware를 이용한 유저의 이메일,비밀번호 검증
  - validateUser를 라우터에 추가하여 회원가입과 로그인 시 입력받은 이메일과 비밀번호가 형식에 맞는지 검증합니다.

#### authenticateToken middleware 구현
   - authenticateToken을 만들어서 JWT 토큰을 인증을 할 수 있습니다. 라우터에 추가하여 로그인한 유저를 통과시켜 기능이 동작하게 만들었습니다.
   
#### pagenation 구현  
 - 게시글 목록을 보여줄 때 기본적으로 10개의 게시글을 최신순으로 보여주게 구현하였습니다. </br>
   URL에 page=1 이런 식으로 쿼리를 넣어주면 특정 페이지의 게시글을 나오게 했습니다.  </br>
   pagenation을 통해 데이터 한정된 데이터를 보여주므로 쿼리성능, 사용자 경험의 향상하며 데이터를 효율적으로 관리하는 데 사용됩니다.
   
#### soft delete 구현
 - 데이터에서 완전히 삭제되는 게 아닌 삭제되었다고 상태를 변경함으로써 기록을 남기고 데이터 복구를 할 수 있습니다.
  - 삭제를 하게 된다면 데이터 isdelete의 기본값인 false가 true로 바뀌면서 deletedAt에도 삭제일이 추가됩니다.
  - 이를 get메소드를 통해서 전체 목록을 조회할 때 조건으로 isdelete가 true인 값을 제외해서 삭제된 게시들은 볼 수 없도록 구현하였습니다.   

</br>

# API 명세(request/response 포함)
https://stitch-badger-f37.notion.site/API-090786a9b9e04b66bd4dfabc626790bb?pvs=4
