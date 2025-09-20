import Subject, { ISubject } from "../models/Subject";

// Tạo môn học
export const createSubjectSv = async (data: Partial<ISubject>) => {
  const subject = new Subject(data);
  await subject.save();
  return subject;
};

// Cập nhật môn học
export const updateSubjectSv = async (_id: string, data: Partial<ISubject>) => {
  if (!_id) throw new Error("ID môn học không hợp lệ");
  const subject = await Subject.findByIdAndUpdate(
    _id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!subject) throw new Error("Môn học không tồn tại");
  return subject;
};

//  Xóa môn học
export const deleteSubjectSv = async (_id: string) => {
  if (!_id) throw new Error("ID môn học không hợp lệ");
  const subject = await Subject.findByIdAndDelete(_id);
  if (!subject) throw new Error("Môn học không tồn tại");
};

// Lấy danh sách môn học với phân trang
export const getSubjectsSv = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [subjects, total] = await Promise.all([
    Subject.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
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

//
export const getSubjectByIdSv = async (_id: string) =>{
  if (!_id) throw new Error("ID môn học không hợp lệ");
  
    const subject = await Subject.findById(_id);
    if (!subject) throw new Error("môn học không tồn tại");
  
    return subject;
}