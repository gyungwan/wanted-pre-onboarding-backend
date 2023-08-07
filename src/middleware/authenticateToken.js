import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // 토큰 추출

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).send("로그인 해주시기 바랍니다."); // 토큰 없음

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("게시글 수정,삭제할 권한이 없습니다."); // 토큰 유효하지 않음
    req.user = { id: user.userId };
    next(); // 다음 미들웨어로 이동
  });
};
