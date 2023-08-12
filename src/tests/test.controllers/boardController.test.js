import * as boardController from "../../controllers/boardController.js";
import * as boardService from "../../services/boardService.js";

const mockRequest = (data = {}) => {
  return {
    ...data,
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../services/boardService.js");

describe("boardController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewBoard", () => {
    it("새 게시글을 만들고 201 상태를 반환해야 합니다.", async () => {
      const req = mockRequest({
        body: { title: "test title", content: "test content" },
        user: { id: 1 },
      });
      const res = mockResponse();

      const mockBoard = { id: 1, title: "test title", content: "test content" };

      boardService.createBoard.mockResolvedValue(mockBoard);

      await boardController.createNewBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBoard);
    });

    it("userId가 없으면 401 상태를 반환해야 합니다.", async () => {
      const req = mockRequest({
        body: { title: "test title", content: "test content" },
        user: {},
      });
      const res = mockResponse();

      await boardController.createNewBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "로그인 후 게시글 작성이 가능합니다.",
      });
    });
  });

  describe("getBoards", () => {
    it("게시글을 목록을 반환합니다.", async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      boardService.getAllBoards.mockResolvedValue([
        { id: 1, title: "Test Board" },
      ]);

      await boardController.getBoards(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, title: "Test Board" }]);
    });
  });

  describe("getBoardById", () => {
    it("일치하는 ID의 게시글이 있으면 200상태와 게시글 반환 합니다.", async () => {
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();
      boardService.getBoard.mockResolvedValue({ id: 1, title: "Test Board" });

      await boardController.getBoardById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, title: "Test Board" });
    });

    it("게시글을 찾지 못했을 때 404를 반환해야 합니다.", async () => {
      const req = mockRequest({ params: { id: 999 } });
      const res = mockResponse();

      boardService.getBoard.mockResolvedValue(null);

      await boardController.getBoardById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("게시글을 찾을 수 없습니다.");
    });
  });

  describe("updateBoard", () => {
    it("게시글을 수정하고 200 상태를 반환해야 합니다.", async () => {
      const req = mockRequest({
        params: { id: 1 },
        body: { title: "updated title", content: "updated content" },
        user: { id: 1 },
      });
      const res = mockResponse();

      const mockUpdatedBoard = {
        id: 1,
        title: "updated title",
        content: "updated content",
      };
      boardService.updateBoardById.mockResolvedValue(mockUpdatedBoard);
      await boardController.updateBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedBoard);
    });

    it("게시글을 찾을 수 없는 경우 404 상태를 반환해야 합니다.", async () => {
      const req = mockRequest({
        params: { id: 999 },
        body: { title: "updated title", content: "updated content" },
        user: { id: 1 },
      });
      const res = mockResponse();

      boardService.updateBoardById.mockResolvedValue(null);

      await boardController.updateBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "게시글을 찾을 수 없습니다.",
      });
    });
  });

  describe("deleteBoard", () => {
    it("게시글을 삭제하고 200 상태를 반환해야 합니다.", async () => {
      const req = mockRequest({
        params: { id: 1 },
        user: { id: 1 },
      });
      const res = mockResponse();

      boardService.deleteBoardById.mockResolvedValue(true);

      await boardController.deleteBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        "게시글이 성공적으로 삭제되었습니다."
      );
    });

    it("게시글을 찾을 수 없는 경우 404 상태를 반환해야 합니다.", async () => {
      const req = mockRequest({
        params: { id: 999 },
        user: { id: 1 },
      });
      const res = mockResponse();

      boardService.deleteBoardById.mockResolvedValue(false);

      await boardController.deleteBoard(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "게시글을 찾을 수 없습니다.",
      });
    });
  });
});
