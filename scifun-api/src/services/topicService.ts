import Topic, { ITopic } from "../models/Topic";
import { esClient } from "../config/elasticSearch";

const TOPIC_INDEX = "topic";

// Thêm Topic
export const createTopicSv = async (data: Partial<ITopic>) => {
  const topic = new Topic(data);
  await topic.save();
  await syncToES();
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

// Lấy danh sách có phân trang + lọc + tìm kiếm
export const getTopicsSv = async (
  page?: number,
  limit?: number,
  subjectId?: string,
  search?: string
) => {
  const must: any[] = [];
  const filters: any[] = [];

  // lọc theo subject nếu có
  if (subjectId) {
    filters.push({ term: { "subject.keyword": subjectId } });
  }

  // tìm kiếm theo tên
  if (search && search.trim() !== "") {
    must.push({
      match: {
        name: {
          query: search.trim(),
          operator: "AND", // chặt chẽ hơn khi search
          fuzziness: "AUTO", // cho phép typo nhẹ
          minimum_should_match: "75%", // yêu cầu mức khớp tối thiểu
        },
      },
    });
  }

  // Nếu không có page và limit thì lấy tất cả
  if (!page || !limit) {
    const result = await esClient.search({
      index: TOPIC_INDEX,
      size: 10000, // Giới hạn tối đa của Elasticsearch
      track_total_hits: true,
      query: {
        bool: {
          must: must.length ? must : [{ match_all: {} }],
          filter: filters
        }
      }
    });

    const hits = result.hits.hits.map((hit: any) => ({
      _id: hit._id,
      ...hit._source
    }));
    
    let total = 0;
    if (typeof result.hits.total === "number") {
      total = result.hits.total;
    } else {
      total = result.hits.total.value;
    }

    return {
      page: 1,
      limit: total,
      total,
      totalPages: 1,
      topics: hits
    };
  }

  // Nếu có page và limit thì phân trang
  const from = (page - 1) * limit;

  const result = await esClient.search({
    index: TOPIC_INDEX,
    from,
    size: limit,
    track_total_hits: true, // để total chính xác
    query: {
      bool: {
        must: must.length ? must : [{ match_all: {} }],
        filter: filters
      }
    }
  });

  const hits = result.hits.hits.map((hit: any) => ({
    _id: hit._id,
    ...hit._source
  }));

  let total = 0;
  if (typeof result.hits.total === "number") {
    total = result.hits.total;
  } else {
    total = result.hits.total.value;
  }

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    topics: hits,
  };
};

// Lấy chi tiết chủ đề
export const getTopicByIdSv = async (_id: string) => {
  if (!_id) throw new Error("ID topic không hợp lệ");

  const topic = await Topic.findById(_id).populate("subject");
  if (!topic) throw new Error("Topic không tồn tại");

  return topic;
};

// Tạm thời
export const syncToES = async (): Promise<void> => {
  try {
    // Xoá hết dữ liệu cũ trong index
    await esClient.deleteByQuery({
      index: TOPIC_INDEX,
      body: {
        query: {
          match_all: {}, // xoá tất cả documents
        },
      },
    } as any); // ép kiểu any để TS không bắt lỗi

    // Lấy dữ liệu từ Mongo
    const topics = await Topic.find().lean();

    for (const topic of topics) {
      const { _id, __v, ...doc } = topic;

      await esClient.index({
        index: TOPIC_INDEX,
        id: _id.toString(),
        document: doc,
        refresh: true,
      });
    }

    console.log("✅ Sync to Elasticsearch completed!");
  } catch (error) {
    console.error("❌ Error syncing:", error);
    throw error;
  }
};
