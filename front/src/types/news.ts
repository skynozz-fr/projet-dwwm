import type { User } from "./user"

export type NewsCategory = "TRANSFER" | "MATCH" | "OTHER"

export type NewsPayload = {
  title: string
  category: NewsCategory
  excerpt: string
  content: string
}

export type News = {
  id: string
  title: string
  excerpt: string
  content: string
  author_id: string | null
  author?: User
  updated_by_id?: string | null
  updated_by?: User
  category: NewsCategory
  created_at: string
  updated_at?: string
}