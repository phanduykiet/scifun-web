import Topic, { ITopic } from "../models/Topic";
import { esClient } from "../config/elasticSearch";

const TOPIC_INDEX = "topic";

// Thêm Topic
export const createTopicSv = async (data: Partial<ITopic>) => {
  const topic = new Topic(data);
  await topic.save();
  // Populate để trả về thông tin đầy đủ
  await topic.populate("subject");
  // Sync lên ES
  await syncOneTopicToES(topic._id.toString());
  
  return topic;
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
  // Sync lên ES
  await syncOneTopicToES(topic._id.toString());
  
  return topic;
};

// Xóa Topic
export const deleteTopicSv = async (_id: string) => {
  if (!_id) throw new Error("ID topic không hợp lệ");

  const topic = await Topic.findByIdAndDelete(_id);
  if (!topic) throw new Error("Topic không tồn tại");
  // Xóa khỏi ES
  await deleteOneTopicFromES(_id);
  
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
  if(subjectId){
    filters.push({ term: { "subject._id": subjectId } });
  }

  // tìm kiếm theo tên
  if (search && search.trim() !== "") {
    must.push({
      match: {
        name: {
          query: search.trim(),
          operator: "AND",               // chặt chẽ hơn khi search
          fuzziness: "AUTO",             // cho phép typo nhẹ
          minimum_should_match: "75%"    // yêu cầu mức khớp tối thiểu
        }
      }
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
    topics: hits
  };
};

// Lấy chi tiết chủ đề
export const getTopicByIdSv = async (_id: string) => {
  if (!_id) throw new Error("ID topic không hợp lệ");

  const topic = await Topic.findById(_id).populate("subject");
  if (!topic) throw new Error("Topic không tồn tại");

  return topic;
};

  // Sync 1 topic lên ES (dùng cho create và update)
  export const syncOneTopicToES = async (topicId: string) => {
    try {
      const topic = await Topic.findById(topicId).populate('subject').lean();
      if (!topic) {
        throw new Error("Topic không tồn tại");
      }

      const subject = topic.subject as any;
      
      const esDocument = {
        name: topic.name,
        description: topic.description || "",
        subject: subject ? {
          _id: subject._id.toString(),
          name: subject.name || "",
          code: subject.code || "",
          description: subject.description || "",
          image: subject.image || ""
        } : null
      };

      await esClient.index({
        index: TOPIC_INDEX,
        id: topicId,
        document: esDocument,
        refresh: true
      });

    } catch (error) {
      throw error;
    }
  };

  // Xóa 1 topic khỏi ES
  export const deleteOneTopicFromES = async (topicId: string) => {
    try {
      await esClient.delete({
        index: TOPIC_INDEX,
        id: topicId,
        refresh: true
      });
    } catch (error: any) {
      // Nếu document không tồn tại trong ES thì bỏ qua
      if (error.meta?.statusCode === 404) {
        throw new Error("Topic không tồn tại trong ES");
      } else {
        throw error;
      }
    }
  };
