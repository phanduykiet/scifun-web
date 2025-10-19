// src/services/subjectService.ts

export interface Subject {
  id?: string; // chưa có khi tạo mới
  name: string;
  description: string;
  image?: string;
  maxTopics: number;
}

export interface SubjectAPIResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  subjects: Subject[];
}

const BASE_URL = "http://localhost:5000/api/v1/subject";

/**
 * Lấy danh sách môn học (có phân trang)
 */
export const getSubjects = async (page = 1, limit = 10): Promise<SubjectAPIResponse> => {
  const res = await fetch(`${BASE_URL}/get-subjects?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch subjects");

  const data = await res.json();
  return data.data || { subjects: [], totalPages: 0, total: 0, page: 1, limit: 10 };
};

/**
 * Tạo mới môn học
 * @param subject Dữ liệu môn học: name, description, maxTopics, image
 */
export const addSubject = async (subject: Omit<Subject, "id">): Promise<Subject> => {
  const res = await fetch(`${BASE_URL}/create-subject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create subject: ${errorText}`);
  }

  const data = await res.json();
  return data.data; // Trả về subject đã tạo
};

/**
 * Cập nhật thông tin môn học
 * @param id ID của môn học cần cập nhật
 * @param subject Dữ liệu môn học cần cập nhật (có thể là một phần)
 */
export const updateSubject = async (id: string, subject: Partial<Omit<Subject, "id">>): Promise<Subject> => {
  const res = await fetch(`${BASE_URL}/update-subject/${id}`, {
    method: "PUT", // Hoặc "PATCH" tùy thuộc vào thiết kế API của bạn
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update subject: ${errorText}`);
  }

  const data = await res.json();
  return data.data; // Trả về subject đã cập nhật
};

/**
 * Lấy thông tin chi tiết một môn học bằng ID
 * @param id ID của môn học
 */
export const getSubjectById = async (id: string): Promise<Subject> => {
  const res = await fetch(`${BASE_URL}/get-subjectById/${id}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch subject with id ${id}: ${errorText}`);
  }
  const data = await res.json();
  return data.data; // Trả về chi tiết subject
};
