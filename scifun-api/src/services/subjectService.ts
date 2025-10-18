import cloudinary from "../config/cloudinary";
import Subject, { ISubject } from "../models/Subject";
import { esClient } from "../config/elasticSearch";

const SUBJECT_INDEX = "subject";

// Tạo môn học
export const createSubjectSv = async (data: Partial<ISubject>) => {
  let imageUrl = data.image;

  // Nếu có ảnh được chọn thì upload lên Cloudinary
  if (data.image && typeof data.image === "string" && data.image.startsWith("uploads/")) {
    const uploadResult = await cloudinary.uploader.upload(data.image, {
      folder: "cb62bef7a80946b11f47eb3f10294c4410", // thư mục bạn tạo trong Cloudinary
    });
    imageUrl = uploadResult.secure_url;
  }

  const subject = new Subject({
    name: data.name,
    description: data.description,
    maxTopics: data.maxTopics,
    image: imageUrl || "https://images-na.ssl-images-amazon.com/images/I/51T8OXMiB5L._SX329_BO1,204,203,200_.jpg",
  });

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

  const result = await esClient.search({
    index: SUBJECT_INDEX,
    from,
    size: limit,
    track_total_hits: true,
    query: must.length ? { bool: { must } } : { match_all: {} }
  });

  // Lấy total (ES 8 trả về number hoặc object)
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