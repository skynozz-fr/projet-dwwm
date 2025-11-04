import type { User } from "./user"

export type NewsCategory = "TRANSFER" | "MATCH" | "OTHER"

export type News = {
  id: number
  title: string
  excerpt: string
  content: string
  author_id: number | null
  author?: User
  category: NewsCategory
  created_at: string
  updated_at?: string
}