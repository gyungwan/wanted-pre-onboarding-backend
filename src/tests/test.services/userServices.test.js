import * as userService from "../../services/userService.js";

// Mock the prisma instance
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
};

describe("userService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserByEmail", () => {
    it("주어진 이메일에 대한 사용자 상세 정보를 반환해야 합니다", async () => {
      const mockEmail = "test@test.com";
      const mockUser = {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        email: mockEmail,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // mockPrisma 객체를 파라미터로 전달합니다.
      const result = await userService.findUserByEmail(mockEmail, mockPrisma);

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: mockEmail,
        },
      });
    });
  });
});
