import Quiz, { IQuiz } from "../models/Quiz";

// Thêm Quiz
export const createQuizSv = async (data: Partial<IQuiz>) => {
  const quiz = new Quiz(data);
  await quiz.save();
  return quiz.populate("topic"); // trả về quiz kèm thông tin topic
};

// Sửa Quiz
export const updateQuizSv = async (_id: string, updateData: Partial<IQuiz>) => {
  if (!_id) throw new Error("ID quiz không hợp lệ");

  const quiz = await Quiz.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("topic");

  if (!quiz) throw new Error("Quiz không tồn tại");
  return quiz;
};

// Xóa Quiz
export const deleteQuizSv = async (_id: string) => {
  if (!_id) throw new Error("ID quiz không hợp lệ");

  const quiz = await Quiz.findByIdAndDelete(_id);
  if (!quiz) throw new Error("Quiz không tồn tại");

  return { message: "Xóa thành công", quiz };
};

// Lấy danh sách Quiz có phân trang + lọc theo topic
export const getQuizzesSv = async (
  page: number,
  limit: number,
  topicId?: string
) => {
  const filter: any = {};
  if (topicId) filter.topic = topicId;

  const skip = (page - 1) * limit;

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("topic"),
    Quiz.countDocuments(filter),
  ]);

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
