export interface TopicMini {
  _id: string;
  name: string;
}
export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    topic: TopicMini;
    questionsCount?: number;  // số câu hỏi
    duration?: number; // thời gian làm bài
  }