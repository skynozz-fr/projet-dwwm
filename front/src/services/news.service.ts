import { api } from "@/lib/api";
import type { News, NewsCategory } from "@/types/news";

export const getAllNews = async (category?: NewsCategory): Promise<News[]> => {
  const url = category ? `/news/category/${category}` : "/news";
  const { data } = await api.get<News[]>(url);
  return data;
};

export const getNewsById = async (id: number): Promise<News> => {
  const { data } = await api.get<News>(`/news/${id}`);
  return data;
};

export const createNews = async (payload: {
  title: string;
  category: NewsCategory;
  excerpt: string;
  content: string;
}): Promise<News> => {
  const { data } = await api.post<News>("/news", payload);
  return data;
};

export const updateNews = async (
  id: number,
  payload: {
    title?: string;
    category?: NewsCategory;
    excerpt?: string;
    content?: string;
  }
): Promise<News> => {
  const { data } = await api.patch<News>(`/news/${id}`, payload);
  return data;
};

export const deleteNews = async (id: number): Promise<void> => {
  await api.delete(`/news/${id}`);
};