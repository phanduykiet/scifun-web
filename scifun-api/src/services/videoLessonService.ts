import VideoLesson, { IVideoLesson } from "../models/VideoLesson";
import { convertToYoutubeEmbed } from "../utils/youtubeHelper";

// Thêm video lesson
export const createVideoLessonSv = async (data: Partial<IVideoLesson>) => {
  // Convert URL sang embed format nếu là YouTube
  if (data.url) {
    data.url = convertToYoutubeEmbed(data.url);
  }

  const videoLesson = new VideoLesson(data);
  await videoLesson.save();
  return videoLesson.populate("topic", "-__v");
};

// Sửa video lesson
export const updateVideoLessonSv = async (
  _id: string,
  updateData: Partial<IVideoLesson>
) => {
  if (!_id) throw new Error("ID video lesson không hợp lệ");

  // Convert URL sang embed format nếu có update URL
  if (updateData.url) {
    updateData.url = convertToYoutubeEmbed(updateData.url);
  }

  const videoLesson = await VideoLesson.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("topic", "-__v");

  if (!videoLesson) throw new Error("Video lesson không tồn tại");
  return videoLesson;
};

// Xóa video lesson
export const deleteVideoLessonSv = async (_id: string) => {
  if (!_id) throw new Error("ID video lesson không hợp lệ");

  const videoLesson = await VideoLesson.findByIdAndDelete(_id);
  if (!videoLesson) throw new Error("Video lesson không tồn tại");

  return { message: "Xóa thành công", videoLesson };
};

// Lấy danh sách theo phân trang (có filter theo topicId nếu cần)
export const getVideoLessonsSv = async (
  page: number,
  limit: number,
  topicId?: string
) => {
  const filter: any = {};
  if (topicId) filter.topic = topicId;

  const skip = (page - 1) * limit;

  const [videoLessons, total] = await Promise.all([
    VideoLesson.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("topic", "-__v")
      .select("-__v"),
    VideoLesson.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: videoLessons,
  };
};

// Lấy chi tiết video lesson
export const getVideoLessonByIdSv = async (_id: string) => {
  if (!_id) throw new Error("ID video lesson không hợp lệ");

  const videoLesson = await VideoLesson.findById(_id).populate("topic");

  if (!videoLesson) throw new Error("Video lesson không tồn tại");
  return videoLesson;
};