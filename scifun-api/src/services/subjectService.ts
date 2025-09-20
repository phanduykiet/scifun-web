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
export const getSubjectsSv = async (page: number, limit: number, search?: string) => {
  const from = (page - 1) * limit;

  const must: any[] = [];
  if (search && search.trim()) {
    must.push({
      multi_match: {
        query: search.trim(),
        fields: ["name^2", "description", "code"], // chỉnh theo schema của bạn
        operator: "AND",               // chặt chẽ hơn khi search
        fuzziness: "AUTO",             // cho phép typo nhẹ
        minimum_should_match: "75%",   // yêu cầu mức khớp tối thiểu
        type: "best_fields",
      },
    });
  }

  const result = await esClient.search({
    index: SUBJECT_INDEX,
    from,
    size: limit,
    track_total_hits: true,
    query: must.length
      ? { bool: { must } }
      : { match_all: {} }, // Không có search thì match_all
  });

  // Lấy total theo dạng ES 8 (object) hoặc number (tùy cấu hình)
  const total =
    typeof (result.hits.total as any) === "number"
      ? (result.hits.total as unknown as number)
      : (result.hits.total as { value: number }).value;

  const subjects = result.hits.hits.map((hit) => ({
    id: hit._id, // trả về id ES
    ...(hit._source as Record<string, any>),
  }));

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    subjects,
  };
};

// Tạm thời 
export const syncSubjectToES = async (): Promise<void> => {
  try {
    // .lean() để lấy plain object
    const subject = await Subject.find().lean();

    for (const lesson of subject) {
      const { _id, __v, ...doc } = lesson;

      await esClient.index({
        index: SUBJECT_INDEX,
        id: _id.toString(),
        document: doc,   // không còn _id trong body
        refresh: true,   // cần thấy ngay khi search (tùy nhu cầu)
      });
    }

    console.log("Sync subject to Elasticsearch completed!");
  } catch (error) {
    console.error("Error syncing subject:", error);
    throw error; // propagate lỗi ra ngoài nếu cần
  }
};


// Lấy chi tiết môn học
export const getSubjectByIdSv = async (_id: string) =>{
  if (!_id) throw new Error("ID môn học không hợp lệ");
  
    const subject = await Subject.findById(_id);
    if (!subject) throw new Error("môn học không tồn tại");
  
    return subject;
}