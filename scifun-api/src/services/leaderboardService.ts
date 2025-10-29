import { Types } from "mongoose";
import Leaderboard from "../models/Leaderboard";
import UserProgress from "../models/UserProgress"; // model tiến trình
import User from "../models/User";      
import Subject from "../models/Subject"; 

export type Period = "daily" | "weekly" | "monthly" | "alltime";

// Lấy bảng xếp hạng cho một môn học
export const getSubjectLeaderboardSv = async (
  subjectId: string,
  page = 1,
  limit = 20,
  period: Period = "alltime"
) => {
  const sid = new Types.ObjectId(subjectId);
  const skip = (page - 1) * limit;

  const total = await Leaderboard.countDocuments({ subjectId: sid, period });

  const rows = await Leaderboard.find({ subjectId: sid, period })
    .sort({ rank: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // map đúng payload bạn mong muốn
  const data = rows.map((r) => ({
    rank: r.rank,
    previousRank: r.previousRank,
    userId: String(r.userId),
    userName: r.userName,
    userAvatar: r.userAvatar,
    subjectId: String(r.subjectId),
    subjectName: r.subjectName,
    progress: r.progress,
    averageScore: r.averageScore,
    totalScore: r.totalScore,
    completedQuizzes: r.completedQuizzes,
    completedTopics: r.completedTopics,
    createdAt: r.progressCreatedAt,
  }));

  return { total, data };
};

// Làm mới bảng xếp hạng cho một môn học
export const rebuildSubjectLeaderboardSv = async (
  subjectId: string,
  period: Period = "alltime"
) => {
  const sid = new Types.ObjectId(subjectId);

  // Lấy rank cũ để gắn previousRank
  const oldRows = await Leaderboard.find({ subjectId: sid, period })
    .select({ userId: 1, rank: 1 })
    .lean();
  const prevRank = new Map<string, number>();
  oldRows.forEach((r) => prevRank.set(String(r.userId), r.rank));

  const MULTIPLIER = 1e12;

  const agg = await UserProgress.aggregate([
    { $match: { subjectId: sid } },
    { $addFields: { totalScore: { $add: ["$progress", "$averageScore"] } } },

    {
      $addFields: {
        createdAtMs: {
          $dateDiff: {
            startDate: new Date(0),
            endDate: "$createdAt",
            unit: "millisecond",
          },
        },
      },
    },
    {
      $addFields: {
        sortKey: { $subtract: [{ $multiply: ["$totalScore", MULTIPLIER] }, "$createdAtMs"] },
      },
    },

    // Join user & subject (giữ nguyên như bạn đang làm)
    {
      $lookup: {
        from: User.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "u",
        pipeline: [{ $project: { fullname: 1, avatar: 1 } }],
      },
    },
    {
      $lookup: {
        from: Subject.collection.name,
        localField: "subjectId",
        foreignField: "_id",
        as: "s",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    { $set: { u: { $first: "$u" }, s: { $first: "$s" } } },

    // Chỉ 1 field trong sortBy để dùng $rank
    {
      $setWindowFields: {
        partitionBy: "$subjectId",
        sortBy: { sortKey: -1 },
        output: { rank: { $rank: {} } }, // hoặc $denseRank
      },
    },

    // Sắp xếp trả về
    { $sort: { sortKey: -1 } },

    {
      $project: {
        _id: 0,
        userId: 1,
        subjectId: 1,
        userName: "$u.fullname",
        userAvatar: "$u.avatar",
        subjectName: "$s.name",
        progress: 1,
        averageScore: 1,
        totalScore: 1,
        completedQuizzes: 1,
        completedTopics: 1,
        rank: 1,
        progressCreatedAt: "$createdAt",
      },
    },
  ]);



  // Upsert snapshot mới
  const ops = agg.map((r: any) => ({
    updateOne: {
      filter: { userId: r.userId, subjectId: r.subjectId, period },
      update: {
        $set: {
          userName: r.userName,
          userAvatar: r.userAvatar,
          subjectName: r.subjectName,
          progress: r.progress ?? 0,
          averageScore: r.averageScore ?? 0,
          totalScore: r.totalScore ?? 0,
          completedQuizzes: r.completedQuizzes ?? 0,
          completedTopics: r.completedTopics ?? 0,
          rank: r.rank,
          previousRank: prevRank.get(String(r.userId)) ?? null,
          progressCreatedAt: r.progressCreatedAt,
          period,
        },
      },
      upsert: true,
    },
  }));

  // Xoá entry không còn trong snapshot
  const keepIds = agg.map((r: any) => r.userId);
  await Leaderboard.deleteMany({
    subjectId: sid,
    period,
    userId: { $nin: keepIds },
  });

  if (ops.length) await Leaderboard.bulkWrite(ops, { ordered: false });

  return { subjectId, period, updated: ops.length };
};
