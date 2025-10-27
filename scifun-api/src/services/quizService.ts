import Quiz, { IQuiz } from "../models/Quiz";
import { esClient } from "../config/elasticSearch";

const QUIZ_INDEX = "quiz";

// Thêm Quiz
export const createQuizSv = async (data: Partial<IQuiz>) => {
  const quiz = new Quiz(data);
  await quiz.save();
  await quiz.populate({
    path: "topic",
    populate: {
      path: "subject",
    },
  });
  // Sync lên ES
  await syncOneQuizToES(quiz._id.toString());

  return quiz;
};

// Sửa Quiz
export const updateQuizSv = async (_id: string, updateData: Partial<IQuiz>) => {
  if (!_id) throw new Error("ID quiz không hợp lệ");

  // Bước 1: Cập nhật quiz
  const updatedQuiz = await Quiz.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate({
    path: "topic",
    populate: {
      path: "subject",
    },
  });

  if (!quiz) throw new Error("Quiz không tồn tại");
  await syncOneQuizToES(quiz._id.toString());

  return quiz;
};

// Xóa Quiz
export const deleteQuizSv = async (_id: string) => {
  if (!_id) throw new Error("ID quiz không hợp lệ");

  const quiz = await Quiz.findByIdAndDelete(_id);
  if (!quiz) throw new Error("Quiz không tồn tại");

  // Xóa khỏi ES
  await deleteOneQuizFromES(_id);
  return { message: "Xóa thành công", quiz };
};

// Lấy danh sách Quiz có phân trang + lọc theo topic
export const getQuizzesSv = async (
  page?: number,
  limit?: number,
  topicId?: string,
  search?: string
) => {
  const filters: any[] = [];
  const must: any[] = [];

  if (topicId) {
    filters.push({ term: { "topic._id": topicId } });
  }

  // Search theo tên
  if (search && search.trim()) {
    must.push({
      match: {
        title: {
          query: search.trim(),
          operator: "AND", // chặt chẽ hơn khi search
          fuzziness: "AUTO", // cho phép typo nhẹ
          minimum_should_match: "75%", // yêu cầu mức khớp tối thiểu
        },
      },
    });
  }

  // Nếu không có page và limit thì lấy tất cả
  if (!page || !limit) {
    const result = await esClient.search({
      index: QUIZ_INDEX,
      size: 10000, // Giới hạn tối đa của Elasticsearch
      track_total_hits: true,
      query: must.length
        ? { bool: { must, filter: filters } }
        : filters.length
        ? { bool: { filter: filters } }
        : { match_all: {} },
    });

    const quizzes = (result.hits.hits as any[]).map((hit) => ({
      _id: hit._id,
      ...hit._source,
    }));

    const total =
      typeof result.hits.total === "number"
        ? result.hits.total
        : result.hits.total?.value || 0;

    return {
      page: 1,
      limit: total,
      total,
      totalPages: 1,
      quizzes,
    };
  }

  // Nếu có page và limit thì phân trang
  const from = (page - 1) * limit;

  const result = await esClient.search({
    index: QUIZ_INDEX,
    from,
    size: limit,
    track_total_hits: true,
    query: must.length
      ? { bool: { must, filter: filters } }
      : filters.length
      ? { bool: { filter: filters } }
      : { match_all: {} },
  });

  const quizzes = (result.hits.hits as any[]).map((hit) => ({
    _id: hit._id,
    ...hit._source,
  }));

  const total =
    typeof result.hits.total === "number"
      ? result.hits.total
      : result.hits.total?.value || 0;

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    quizzes,
  };
};

// Lấy chi tiết Quiz
export const getQuizByIdSv = async (_id: string) => {
  if (!_id) throw new Error("ID quiz không hợp lệ");

  const quiz = await Quiz.findById(_id).populate("topic");
  if (!quiz) throw new Error("Quiz không tồn tại");

  return quiz;
};

// Lấy danh sách Quiz thịnh hành
export const getTrendingQuizzesSv = async (
  page: number,
  limit: number,
  timeWeight: number,
  popularityWeight: number
) => {
  const skip = (page - 1) * limit;
  // Lấy tất cả quiz có lastAttemptAt (quiz đã từng có người làm)
  const quizzes = await Quiz.find({ lastAttemptAt: { $ne: null } })
    .populate("topic")
    .lean();

  if (quizzes.length === 0) {
    return {
      page,
      limit,
      total: 0,
      totalPages: 0,
      data: [],
    };
  }

  // Lấy thời gian hiện tại
  const now = Date.now();

  // Tính khoảng thời gian max để normalize
  const times = quizzes.map((q) =>
    q.lastAttemptAt ? now - new Date(q.lastAttemptAt).getTime() : Infinity
  );
  const maxTimeDiff = Math.max(...times.filter((t) => t !== Infinity));

  // Lấy số lượng người làm max để normalize
  const maxUserCount = Math.max(...quizzes.map((q) => q.uniqueUserCount || 0));

  // Tính điểm cho mỗi quiz
  const quizzesWithScore = quizzes.map((quiz) => {
    // 1. Điểm thời gian (càng gần = điểm càng cao)
    const timeDiff = quiz.lastAttemptAt
      ? now - new Date(quiz.lastAttemptAt).getTime()
      : maxTimeDiff;

    // Normalize về 0-1, đảo ngược (gần nhất = 1, xa nhất = 0)
    const timeScore = maxTimeDiff > 0 ? 1 - timeDiff / maxTimeDiff : 0;

    // 2. Điểm độ phổ biến (càng nhiều người = điểm càng cao)
    const popularityScore =
      maxUserCount > 0 ? (quiz.uniqueUserCount || 0) / maxUserCount : 0;

    // 3. Điểm tổng hợp (weighted average)
    const finalScore =
      timeScore * timeWeight + popularityScore * popularityWeight;

    return {
      ...quiz,
      _score: finalScore,
      _timeScore: timeScore,
      _popularityScore: popularityScore,
    };
  });

  // Sắp xếp theo điểm tổng hợp (giảm dần)
  quizzesWithScore.sort((a, b) => b._score - a._score);

  // Phân trang
  const paginatedQuizzes = quizzesWithScore.slice(skip, skip + limit);

  return {
    page,
    limit,
    total: quizzesWithScore.length,
    totalPages: Math.ceil(quizzesWithScore.length / limit),
    data: paginatedQuizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      topic: quiz.topic,
      uniqueUserCount: quiz.uniqueUserCount,
      lastAttemptAt: quiz.lastAttemptAt,
      score: Math.round(quiz._score * 100) / 100, // Điểm tổng hợp
    })),
  };
};

// Sync 1 quiz lên ES
export const syncOneQuizToES = async (quizId: string) => {
  try {
    const quiz = await Quiz.findById(quizId)
      .populate({
        path: "topic",
        populate: {
          path: "subject",
        },
      })
      .lean();

    if (!quiz) {
      throw new Error("Quiz không tồn tại");
    }

    const topic = quiz.topic as any;
    const subject = topic?.subject as any;

    const esDocument = {
      title: quiz.title,
      description: quiz.description || "",
      duration: quiz.duration,
      questionCount: quiz.questionCount,
      uniqueUserCount: quiz.uniqueUserCount || 0,
      favoriteCount: quiz.favoriteCount || 0,
      lastAttemptAt: quiz.lastAttemptAt || null,
      topic: topic
        ? {
            _id: topic._id.toString(),
            name: topic.name || "",
            description: topic.description || "",
            subject: subject
              ? {
                  _id: subject._id.toString(),
                  name: subject.name || "",
                  code: subject.code || "",
                  description: subject.description || "",
                  image: subject.image || "",
                }
              : null,
          }
        : null,
    };

    await esClient.index({
      index: QUIZ_INDEX,
      id: quizId,
      document: esDocument,
      refresh: true,
    });
  } catch (error) {
    throw error;
  }
};

// Xóa 1 quiz khỏi ES
export const deleteOneQuizFromES = async (quizId: string) => {
  try {
    await esClient.delete({
      index: QUIZ_INDEX,
      id: quizId,
      refresh: true,
    });
  } catch (error: any) {
    if (error.meta?.statusCode === 404) {
      throw new Error("Quiz không tồn tại trong ES");
    } else {
      throw error;
    }
  }
};
