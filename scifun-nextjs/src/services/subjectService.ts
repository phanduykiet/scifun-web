// src/services/subjectService.ts

export interface Subject {
  id: string;
  name: string;
  description: string;
  image?: string;
  maxTopics: number;
}

const BASE_URL = "http://localhost:5000/api/v1/subject";

export const getSubjects = async (page = 1, limit = 10): Promise<Subject[]> => {
  const res = await fetch(`${BASE_URL}/get-subjects?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch subjects");

  const data = await res.json();

  // Trả về mảng subjects
  return data.data?.subjects || [];
};
