import Question, { IQuestion } from "../models/Question";

// Thêm câu hỏi
export const createQuestionSv = async (data: Partial<IQuestion>) => {
  const question = new Question(data);
  await question.save();
  return question.populate("quiz"); // populate quiz để lấy chi tiết quiz
};

// Sửa câu hỏi
export const updateQuestionSv = async (
  _id: string,
  updateData: Partial<IQuestion>
) => {
  if (!_id) throw new Error("ID câu hỏi không hợp lệ");

  const question = await Question.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("quiz");

  if (!question) throw new Error("Câu hỏi không tồn tại");
  return question;
};

// Xóa câu hỏi
export const deleteQuestionSv = async (_id: string) => {
  if (!_id) throw new Error("ID câu hỏi không hợp lệ");

  const question = await Question.findByIdAndDelete(_id);
  if (!question) throw new Error("Câu hỏi không tồn tại");

  return { message: "Xóa thành công", question };
};

// Lấy danh sách theo phân trang (có filter theo quizId nếu cần)
export const getQuestionsSv = async (
  page: number,
  limit: number,
  quizId?: string
) => {
  const filter: any = {};
  if (quizId) filter.quiz = quizId;

  const skip = (page - 1) * limit;

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("quiz"),
    Question.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: questions,
  };
};

// Lấy chi tiết câu hỏi
export const getQuestionByIdSv = async (_id: string) => {
  if (!_id) throw new Error("ID câu hỏi không hợp lệ");

  const question = await Question.findById(_id).populate("quiz");

  if (!question) throw new Error("Câu hỏi không tồn tại");
  return question;
};
