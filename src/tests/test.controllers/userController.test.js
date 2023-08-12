import * as userController from "../../controllers/userController.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { interpolators } from "sharp";
import { json } from "express";
import { PrismaClient } from "@prisma/client";

// const mockedPrismaClient = {
//   user: {
//     creade: jest.fn(),
//   },
// };
const mockCreate = jest.fn();
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => {
      return {
        user: {
          create: mockCreate,
        },
      };
    }),
  };
});
jest.mock("../../utils/hashPassword.js");

describe("userController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("사용자를 등록하고 200 상태 코드를 반환해야 합니다", async () => {
      const mockUser = { email: "test@test.com", password: "hashPassword" };
      const req = {
        body: { email: "@test.com", password: "password" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      const next = jest.fn();

      hashPassword.mockResolvedValue("hashedPassword");
      mockCreate.mockResolvedValue(mockUser);

      await userController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("오류를 처리하고 500 상태코드를 반환해야 합니다.", async () => {
      const req = {
        body: {
          email: "test@tst.com",
          password: "password",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();

      mockCreate.mockRejectedValue(new Error());

      await userController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("회원가입이 실패 하였습니다.");
    });
  });
});
