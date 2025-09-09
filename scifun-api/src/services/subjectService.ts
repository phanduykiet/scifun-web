import Subject, { ISubject } from "../models/Subject";

// Tạo môn học
export const createSubjectSv = async (name?: string, description?: string, maxTopics?: number) => {
    if (name && description && maxTopics) {
        const subject = new Subject({
            name,
            description,
            maxTopics,
        });
        await subject.save();
        return subject;
    }
    throw new Error("Dữ liệu không hợp lệ");
}

// Cập nhật môn học
export const updateSubjectSv = async (_id: string, name?: string, description?: string, maxTopics?: number) => {
    if (!_id) throw new Error("ID môn học không hợp lệ");
    const subject = await Subject.findByIdAndUpdate(
      _id,
      { name, description, maxTopics },
      { new: true }
    );
    if (!subject) throw new Error("Môn học không tồn tại");
    return subject;
}

//  Xóa môn học
export const deleteSubjectSv = async (_id: string) => {
    if (!_id) throw new Error("ID môn học không hợp lệ");
    const subject = await Subject.findByIdAndDelete(_id);
    if (!subject) throw new Error("Môn học không tồn tại");
}

// Lấy danh sách môn học với phân trang
export const getSubjectsSv = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [subjects, total] = await Promise.all([
    Subject.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Subject.countDocuments(),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    subjects,
  };
};