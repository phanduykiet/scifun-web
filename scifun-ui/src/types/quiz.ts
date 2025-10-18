export interface Quiz {
    id: string;
    title: string;
    description?: string;
    subject?: string;
    questionsCount?: number;  // số câu hỏi
    durationMinutes?: number; // thời gian làm bài
  }