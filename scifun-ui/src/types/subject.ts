export interface Subject {
    id: string;
    name: string;
    description: string;
    maxTopics: number;
    image: string;
  }
  
  export interface GetSubjectResponse {
    status: number;
    message: string;
    data: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      subjects: Subject[];
    };
  }
  