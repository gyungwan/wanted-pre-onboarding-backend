//-------- 회원가입 유저 이메일 비밀번호 유효성 검사 -------
export const validateUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).send("이메일 형식이 잘못되었습니다.");
  }

  if (!password || password.length < 8) {
    return res.status(400).send(" 비밀번호는 8자 이상이어야 합니다. ");
  }

  next();
};
