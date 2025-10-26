import cloudinary from "../config/cloudinary";
import Subject, { ISubject } from "../models/Subject";
import { esClient } from "../config/elasticSearch";

const SUBJECT_INDEX = "subject";

// Tạo môn học
export const createSubjectSv = async (data: Partial<ISubject>) => {
  const subject = new Subject(data);
  await subject.save();

  // Sync lên ES
  await syncOneSubjectToES(subject._id.toString());
  return subject;
};

// Cập nhật môn học
export const updateSubjectSv = async (_id: string, data: Partial<ISubject>) => {
  if (!_id) throw new Error("ID subject không hợp lệ");

  const subject = await Subject.findByIdAndUpdate(
    _id,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!subject) throw new Error("Subject không tồn tại");

  // Sync lên ES
  await syncOneSubjectToES(subject._id.toString());
  return subject;
};

//  Xóa môn học
export const deleteSubjectSv = async (_id: string) => {
  if (!_id) throw new Error("ID subject không hợp lệ");

  const subject = await Subject.findByIdAndDelete(_id);
  if (!subject) throw new Error("Subject không tồn tại");

  // Xoá khỏi ES
  await deleteOneSubjectFromES(_id);
  return { message: "Xóa subject thành công", subject };
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

// Lấy chi tiết môn học
export const getSubjectByIdSv = async (_id: string) =>{
  if (!_id) throw new Error("ID môn học không hợp lệ");
  
    const subject = await Subject.findById(_id);
    if (!subject) throw new Error("môn học không tồn tại");
  
    return subject;
}

// Sync 1 subject lên ES (create/update)
export const syncOneSubjectToES = async (subjectId: string) => {
  try {
    const subject = await Subject.findById(subjectId).lean();
    if (!subject) throw new Error("Subject không tồn tại");

    const esDocument = {
      name: subject.name,
      description: subject.description || "",
      maxTopics: subject.maxTopics ?? 20,
      image: subject.image || "https://res.cloudinary.com/dglm2f7sr/image/upload/v1761400287/default_gdfbhs.png"
    };

    await esClient.index({
      index: SUBJECT_INDEX,
      id: subjectId,
      document: esDocument,
      refresh: true
    });
  } catch (error) {
    throw error;
  }
};

// Xoá 1 subject khỏi ES
export const deleteOneSubjectFromES = async (subjectId: string) => {
  try {
    await esClient.delete({
      index: SUBJECT_INDEX,
      id: subjectId,
      refresh: true
    });
  } catch (error: any) {
    if (error.meta?.statusCode === 404) {
      throw new Error("Subject không tồn tại trong ES");
    }
    throw error;
  }
};