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
<img width="1107" alt="스크린샷 2023-08-07 오후 12 26 18" src="https://github.com/gyungwan/wanted-pre-onboarding-

</br>

# 구현한 API의 동작 영상 
https://youtu.be/4h8VnlgwLlg

</br>

# 구현 방법 및 이유에 대한 간략한 설명

</br>

# API 명세(request/response 포함)
https://stitch-badger-f37.notion.site/API-090786a9b9e04b66bd4dfabc626790bb?pvs=4
