import { Request, Response } from "express";
import {
  getSubjectLeaderboardSv,
  rebuildSubjectLeaderboardSv,
  Period,
} from "../services/leaderboardService";

// Lấy bảng xếp hạng cho một môn học
export const getSubjectLeaderboard = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const period = (req.query.period as Period) || "alltime";

    if (!subjectId)
      return res.status(400).json({ status: 400, message: "subjectId is required" });

    const { total, data } = await getSubjectLeaderboardSv(subjectId, page, limit, period);

    return res.status(200).json({
      status: 200,
      total,
      page,
      limit,
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};

// Làm mới bảng xếp hạng cho một môn học
export const rebuildSubjectLeaderboard = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const period = (req.query.period as Period) || "alltime";

    if (!subjectId)
      return res.status(400).json({ status: 400, message: "subjectId is required" });

    const result = await rebuildSubjectLeaderboardSv(subjectId, period);

    return res.status(200).json({
      status: 200,
      message: "Rebuild leaderboard thành công",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ status: 400, message: err.message });
  }
};
