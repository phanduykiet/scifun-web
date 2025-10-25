import cloudinary from "../config/cloudinary";
import Subject, { ISubject } from "../models/Subject";
import { esClient } from "../config/elasticSearch";

const SUBJECT_INDEX = "subject";

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

// Lấy danh sách môn học với phân trang + tìm kiếm theo tên môn học
export const getSubjectsSv = async (page?: number, limit?: number, search?: string) => {
  const must: any[] = [];

  // Search theo tên / mô tả / code
  if (search && search.trim()) {
    must.push({
      multi_match: {
        query: search.trim(),
        fields: ["name^2", "description", "code"], // ưu tiên name
        operator: "AND",
        fuzziness: "AUTO",
        minimum_should_match: "75%",
      }
    });
  }

  // Nếu không có page và limit thì lấy tất cả
  if (!page || !limit) {
    const result = await esClient.search({
      index: SUBJECT_INDEX,
      size: 10000, // Giới hạn tối đa của Elasticsearch
      track_total_hits: true,
      query: must.length ? { bool: { must } } : { match_all: {} }
    });

    const total =
      typeof result.hits.total === "number"
        ? result.hits.total
        : result.hits.total?.value || 0;

    const subjects = result.hits.hits.map((hit: any) => ({
      _id: hit._id,
      ...hit._source
    }));

    return {
      page: 1,
      limit: total,
      total,
      totalPages: 1,
      subjects
    };
  }

  // Nếu có page và limit thì phân trang
  const from = (page - 1) * limit;

  const result = await esClient.search({
    index: SUBJECT_INDEX,
    from,
    size: limit,
    track_total_hits: true,
    query: must.length ? { bool: { must } } : { match_all: {} }
  });

  const total =
    typeof result.hits.total === "number"
      ? result.hits.total
      : result.hits.total?.value || 0;

  const subjects = result.hits.hits.map((hit: any) => ({
    _id: hit._id,
    ...hit._source
  }));

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    subjects
  };
};

// Tạm thời 
export const syncToES = async (): Promise<void> => {
  try {
    // Xoá hết dữ liệu cũ trong index
    await esClient.deleteByQuery({
      index: SUBJECT_INDEX,
      body: {
        query: {
          match_all: {}   // xoá tất cả documents
        }
      }
    } as any); // ép kiểu any để TS không bắt lỗi


    // Lấy dữ liệu từ Mongo
    const subjects = await Subject.find().lean();

    for (const subject of subjects) {
      const { _id, __v, ...doc } = subject;

      await esClient.index({
        index: SUBJECT_INDEX,
        id: _id.toString(),
        document: doc,
        refresh: true
      });
    }

    console.log("✅ Sync to Elasticsearch completed!");
  } catch (error) {
    console.error("❌ Error syncing:", error);
    throw error;
  }
};


// Lấy chi tiết môn học
export const getSubjectByIdSv = async (_id: string) =>{
  if (!_id) throw new Error("ID môn học không hợp lệ");
  
    const subject = await Subject.findById(_id);
    if (!subject) throw new Error("môn học không tồn tại");
  
    return subject;
}