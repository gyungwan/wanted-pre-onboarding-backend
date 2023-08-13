import { PrismaClient } from "@prisma/client";
import { findUserByEmail } from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword } from "../utils/hashPassword.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const prisma = new PrismaClient();

  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("회원가입이 실패 하였습니다.");
  }
};

export const login = async (req, res, next) => {
  const prisma = new PrismaClient(); // PrismaClient 인스턴스 생성

  try {
    const { email, password } = req.body;

    // findUserByEmail에 prisma 인스턴스 전달
    const user = await findUserByEmail(email, prisma);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await generateToken(user.id);
      res.status(200).json({ token });
    } else {
      res
        .status(400)
        .json({ message: "이메일이 잘못되었거나 비밀번호가 잘못되었습니다." });
    }
  } catch (error) {
    next(error);
  }
};
