export interface User {
  id: string
  name: string
  email: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: Date
  updatedAt: Date
  published: boolean
  featured: boolean
  readingTime: number
  categories: string[]
  tags: string[]
  author: {
    id: string
    name: string
    image?: string
  }
}

export interface Category {
  id: string | null
  name: string
  slug: string
  count: number
}

export interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string
    image?: string
  }
}
