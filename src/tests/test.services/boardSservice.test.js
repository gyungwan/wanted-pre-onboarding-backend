import * as boardService from "../../services/boardService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("boardService", () => {
  let testUserId; // 사용자 ID를 저장할 변수

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: "testuser@example.com",
      },
    });

    // 테스트 시작 전 사용자 생성
    const testUser = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        password: "testpassword", // 비밀번호는 해싱을 고려해야 합니다.
      },
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    // 테스트 종료 후 사용자 삭제
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect(); // Prisma client 연결 종료
  });

  describe("createBoard", () => {
    it("새 게시글을 만들어 반환합니다.", async () => {
      const title = "Test Title";
      const content = "Test Content";

      const newBoard = await boardService.createBoard(
        title,
        content,
        testUserId
      );
      expect(newBoard.title).toBe(title);
      expect(newBoard.content).toBe(content);
      expect(newBoard.userId).toBe(testUserId);

      // 생성된 게시글 삭제 (테스트 정리)
      await prisma.board.delete({
        where: {
          id: newBoard.id,
        },
      });
    });
  });

  describe("getAllBoards", () => {
    beforeAll(async () => {
      const currentTime = new Date();
      const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000);
      const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000);

      try {
        // 테스트 시작 전 필요한 데이터(게시물) 생성
        await prisma.board.createMany({
          data: [
            {
              title: "Title 1",
              content: "Content 1",
              userId: testUserId,
              createdAt: twoMinutesAgo,
            },
            {
              title: "Title 2",
              content: "Content 2",
              userId: testUserId,
              deletedAt: new Date(),
              createdAt: oneMinuteAgo,
            }, // Soft delete된 게시물
            {
              title: "Title 3",
              content: "Content 3",
              userId: testUserId,
              createdAt: currentTime,
            },
          ],
        });
      } catch (error) {
        console.error("게시글 생성중 오류 확인하려고", error);
      }
    });

    it("소프트 삭제된 게시글을 제외한 모든 게시글을 반환해야 합니다 ", async () => {
      const boards = await boardService.getAllBoards(0, 10);
      expect(boards.length).toBe(2);
      expect(boards[0].title).toBe("Title 3"); // 최신순 확인
      expect(boards[1].title).toBe("Title 1");
    });
  });
  describe("getBoard", () => {
    let createdBoardId; // 생성된 게시글의 ID를 저장할 변수

    beforeAll(async () => {
      const testBoard = await prisma.board.create({
        data: {
          title: "Test Title for getBoard",
          content: "Test Content for getBoard",
          userId: testUserId,
        },
      });
      createdBoardId = testBoard.id;
    });

    it("ID를 기반으로 일치하는 게시글을 반환해야 합니다.", async () => {
      const retrievedBoard = await boardService.getBoard(createdBoardId);

      expect(retrievedBoard.id).toBe(createdBoardId);
      expect(retrievedBoard.title).toBe("Test Title for getBoard");
      expect(retrievedBoard.content).toBe("Test Content for getBoard");
    });

    afterAll(async () => {
      // 해당 테스트 종료 후 생성한 게시글 삭제
      await prisma.board.delete({
        where: {
          id: createdBoardId,
        },
      });
    });
  });

  describe("updateBoardById", () => {
    let boardIdToUpdate;

    beforeAll(async () => {
      const testBoard = await prisma.board.create({
        data: {
          title: "Original Title",
          content: "Original Content",
          userId: testUserId,
        },
      });
      boardIdToUpdate = testBoard.id;
    });

    it("수정된 제목과 내용으로 게시글을 업데이트해야 합니다", async () => {
      const newTitle = "Updated Title";
      const newContent = "Updated Content";

      const updatedBoard = await boardService.updateBoardById(
        boardIdToUpdate,
        newTitle,
        newContent,
        testUserId
      );

      expect(updatedBoard.title).toBe(newTitle);
      expect(updatedBoard.content).toBe(newContent);
    });

    it("게시글이 존재하지 않으면 오류를 발생시켜야 합니다", async () => {
      await expect(
        boardService.updateBoardById(
          "nonexistent-id",
          "Some Title",
          "Some Content",
          testUserId
        )
      ).rejects.toThrow("게시글을 찾을수 없습니다.");
    });

    it("사용자에게 권한이 없으면 오류가 발생합니다.", async () => {
      const anotherUserId = "another-user-id"; // 이 ID는 게시글의 소유자가 아닙니다.
      await expect(
        boardService.updateBoardById(
          boardIdToUpdate,
          "Some Title",
          "Some Content",
          anotherUserId
        )
      ).rejects.toThrow("게시글 수정 권한이 없습니다.");
    });

    afterAll(async () => {
      // 해당 테스트 종료 후 생성한 게시글 삭제
      await prisma.board.delete({
        where: {
          id: boardIdToUpdate,
        },
      });
    });
  });
  //
  describe("deleteBoardById", () => {
    let boardIdToDelete;

    beforeAll(async () => {
      const testBoard = await prisma.board.create({
        data: {
          title: "Title for Deletion",
          content: "Content for Deletion",
          userId: testUserId,
        },
      });
      boardIdToDelete = testBoard.id;
    });

    it("게시글을 소프트 삭제해야 합니다.", async () => {
      const deletedBoard = await boardService.deleteBoardById(
        boardIdToDelete,
        testUserId
      );
      expect(deletedBoard.isDeleted).toBeTruthy();
      expect(deletedBoard.deletedAt).not.toBeNull();
    });

    it("게시글이 존재하지 않으면 오류를 반환해야 합니다.", async () => {
      await expect(
        boardService.deleteBoardById("nonexistent-id", testUserId)
      ).rejects.toThrow("게시글을 찾을수 없습니다.");
    });

    it("사용자에게 권한이 없으면 오류를 반환해야 합니다.", async () => {
      const anotherUserId = "another-user-id"; // 이 ID는 게시글의 소유자가 아닙니다.
      await expect(
        boardService.deleteBoardById(boardIdToDelete, anotherUserId)
      ).rejects.toThrow("게시글 삭제 권한이 없습니다. ");
    });

    afterAll(async () => {
      // 테스트 종료 후 실제로 게시물 삭제 (데이터 정리)
      await prisma.board.delete({
        where: {
          id: boardIdToDelete,
        },
      });
    });
  });

  // ... 기타 다른 테스트들
});
