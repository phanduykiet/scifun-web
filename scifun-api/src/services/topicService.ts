import Topic, { ITopic } from "../models/Topic";

// Thêm Topic
export const createTopicSv = async (data: Partial<ITopic>) => {
  const topic = new Topic(data);
  await topic.save();
  return topic.populate("subject"); // populate để trả luôn thông tin Subject
};

// Sửa Topic
export const updateTopicSv = async (
  _id: string,
  updateData: Partial<ITopic>
) => {
  if (!_id) throw new Error("ID topic không hợp lệ");

  const topic = await Topic.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("subject");

  if (!topic) throw new Error("Topic không tồn tại");
  return topic;
};

// Xóa Topic
export const deleteTopicSv = async (_id: string) => {
  if (!_id) throw new Error("ID topic không hợp lệ");

  const topic = await Topic.findByIdAndDelete(_id);
  if (!topic) throw new Error("Topic không tồn tại");

  return { message: "Xóa thành công", topic };
};

// Lấy danh sách có phân trang
export const getTopicsSv = async (
  page: number,
  limit: number,
  subjectId?: string
) => {
  const filter: any = {};
  if (subjectId) filter.subject = subjectId; // lọc theo subject nếu có

  const skip = (page - 1) * limit;

  const [topics, total] = await Promise.all([
    Topic.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("subject"),
    Topic.countDocuments(filter),
  ]);

  return {
    limit,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    topics
  };
};
