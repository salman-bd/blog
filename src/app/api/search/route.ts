import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!query) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 })
    }

    // Search articles in database
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } }  
        ],
        status: "published",
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const total = await prisma.article.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } }  
        ],
        status: "published",
      },
    })

    return NextResponse.json({
      articles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error searching articles:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

