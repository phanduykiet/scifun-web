// src/types/topic.ts

export interface Topic {
    _id: string;
    name: string;
    description?: string;
    subjectId: string; // ID của môn học mà topic thuộc về
  }
  
  export interface GetTopicResponse {
    status: number;
    message: string;
    data: Topic[];
  }
  