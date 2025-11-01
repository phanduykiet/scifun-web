export interface TopicMini {
  _id: string;
  name: string;
  description: string;
  subject: SubjectMini;
}
export interface SubjectMini {
  _id: string;
  name: string;
  description: string;
  image: string;
}
export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    topic: TopicMini;
    questionsCount?: number; 
    duration?: number; 
    accessTier?: string;
  }