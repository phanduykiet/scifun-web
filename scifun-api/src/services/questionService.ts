import Question, { IQuestion } from "../models/Question";
import Quiz from "../models/Quiz";
import User from "../models/User";

// Kiểm tra quyền truy cập quiz (FREE/PRO)
export const checkQuizAccess = async (userId?: string, quizId?: string) => {
  if (!quizId) throw new Error("Thiếu quizId");

  // Lấy thông tin quiz
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Không tìm thấy quiz");

  // Nếu quiz FREE → ai cũng làm được
  if (quiz.accessTier === "FREE") return true;

  // Nếu quiz PRO → cần user có gói PRO hợp lệ
  if (!userId) {
    throw new Error("Cần đăng nhập để làm quiz PRO");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }

  const sub = user.subscription;
  const isPro =
    sub?.status === "ACTIVE" &&
    sub?.tier === "PRO" &&
    sub?.currentPeriodEnd &&
    new Date(sub.currentPeriodEnd) > new Date();

  if (!isPro) {
    throw new Error("Tài khoản của bạn chưa có gói PRO hoặc đã hết hạn");
  }

  return true;
};

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

// Lấy danh sách theo phân trang 
export const getQuestionsSv = async (
  page: number,
  limit: number,
  quizId?: string,
  userId?: string
) => {
  await checkQuizAccess(userId, quizId);
  const filter: any = {};
  if (quizId) filter.quiz = quizId;

  const skip = (page - 1) * limit;

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("quiz" , "-__v")
      .select("-__v"),
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

  const question = await Question.findById(_id).populate("quiz", "-__v").select("-__v");

  if (!question) throw new Error("Câu hỏi không tồn tại");
  return question;
};
