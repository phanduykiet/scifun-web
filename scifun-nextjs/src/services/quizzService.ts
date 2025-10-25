// src/services/quizzService.ts

import { Topic } from "./topicsService";

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  topic: string | Topic; // Can be just an ID or a populated Topic object
  uniqueUserCount: number;
  lastAttemptAt?: Date | string | null;
  favoriteCount: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface QuizAPIResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  quizzes: Quiz[];
}

const BASE_URL = "http://localhost:5000/api/v1/quiz";

/**
 * Lấy danh sách quiz (phân trang, lọc, tìm kiếm)
 * Endpoint: GET /api/v1/quiz/get-quizzes?page=1&limit=10&topicId=...&search=...
 */
export const getQuizzes = async (
  page = 1,
  limit = 10,
  topicId?: string,
  search = ''
): Promise<QuizAPIResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (topicId) params.append('topicId', topicId);
  if (search) params.append('search', search);

  const res = await fetch(`${BASE_URL}/get-quizzes?${params.toString()}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch quizzes: ${errorText}`);
  }

  const json = await res.json();
  // The backend already maps _id to id, so we can use the data directly.
  return json.data as QuizAPIResponse;
};

// /**
//  * Lấy chi tiết quiz theo ID
//  * Endpoint: GET /api/v1/quiz/get-quizById/:id
//  */
export const getQuizById = async (id: string): Promise<Quiz> => {
  const res = await fetch(`${BASE_URL}/get-quizById/${id}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch quiz with id ${id}: ${errorText}`);
  }

  const json = await res.json();
  const quizData = json.data;

  return {
    id: quizData._id,
    title: quizData.title,
    description: quizData.description,
    topic: quizData.topic ?? null, // Handle null topic
    uniqueUserCount: quizData.uniqueUserCount,
    lastAttemptAt: quizData.lastAttemptAt,
    favoriteCount: quizData.favoriteCount,
    createdAt: quizData.createdAt,
    updatedAt: quizData.updatedAt
  };
};

/**
 * Tạo mới quiz
 * Endpoint: POST /api/v1/quiz/create-quiz
 */
export const addQuiz = async (quiz: {
  title: string;
  description: string;
  topic: string;
}): Promise<Quiz> => {
  const res = await fetch(`${BASE_URL}/create-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create quiz: ${errorText}`);
  }

  const json = await res.json();
  const createdQuiz = json.data;
  // Explicitly map properties from the backend response to the frontend Quiz interface
  // to ensure consistency and handle potential _id to id conversion.
  return {
    id: createdQuiz._id,
    title: createdQuiz.title,
    description: createdQuiz.description,
    topic: createdQuiz.topic,
    uniqueUserCount: createdQuiz.uniqueUserCount,
    lastAttemptAt: createdQuiz.lastAttemptAt ?? null, // Ensure null if not provided
    favoriteCount: createdQuiz.favoriteCount,
    createdAt: createdQuiz.createdAt,
    updatedAt: createdQuiz.updatedAt,
  };
};

/**
 * Cập nhật quiz
 * Endpoint: PUT /api/v1/quiz/update-quiz/:id
 */
export const updateQuiz = async (
  id: string,
  quiz: Partial<Omit<Quiz, "id">>
): Promise<Quiz> => {
  const res = await fetch(`${BASE_URL}/update-quiz/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update quiz: ${errorText}`);
  }

  const json = await res.json();
  const updatedQuiz = json.data;
  // Chuẩn hóa dữ liệu trả về để khớp với interface Quiz của frontend
  return {
    id: updatedQuiz._id,
    title: updatedQuiz.title,
    description: updatedQuiz.description,
    topic: updatedQuiz.topic,
    uniqueUserCount: updatedQuiz.uniqueUserCount,
    lastAttemptAt: updatedQuiz.lastAttemptAt,
    favoriteCount: updatedQuiz.favoriteCount,
    createdAt: updatedQuiz.createdAt,
    updatedAt: updatedQuiz.updatedAt,
  };
};

/**
 * Xóa quiz theo ID
 * Endpoint: DELETE /api/v1/quiz/delete-quiz/:id
 */
export const deleteQuiz = async (
  id: string
): Promise<{ message: string; quiz: Quiz }> => {
  const res = await fetch(`${BASE_URL}/delete-quiz/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete quiz: ${errorText}`);
  }

  const json = await res.json();
  const deletedQuiz = json.data.quiz;

  return {
    message: json.data.message || "Xóa quiz thành công",
    quiz: {
      id: deletedQuiz._id,
      title: deletedQuiz.title,
      description: deletedQuiz.description,
      topic: deletedQuiz.topic ?? null,
      uniqueUserCount: deletedQuiz.uniqueUserCount,
      lastAttemptAt: deletedQuiz.lastAttemptAt ? new Date(deletedQuiz.lastAttemptAt) : null,
      favoriteCount: deletedQuiz.favoriteCount,
      createdAt: deletedQuiz.createdAt ? new Date(deletedQuiz.createdAt) : undefined,
      updatedAt: deletedQuiz.updatedAt ? new Date(deletedQuiz.updatedAt) : undefined,
    },
  };
};
