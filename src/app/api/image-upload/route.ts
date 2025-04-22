import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG and WebP are supported." },
        { status: 400 },
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, message: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`
    const publicDir = join(process.cwd(), "public")
    const uploadsDir = join(publicDir, "uploads")

    // Ensure uploads directory exists
    try {
      await writeFile(join(uploadsDir, fileName), buffer)
    } catch (error) {
      console.error("Error writing file:", error)
      return NextResponse.json({ success: false, message: "Failed to save file" }, { status: 500 })
    }

    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: "Image uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 })
  }
}
