import { type NextRequest, NextResponse } from "next/server";  
import { v2 as cloudinary } from "cloudinary";  
import { getServerSession } from "next-auth";  
import { authOptions } from "@/app/api/auth/[...nextauth]/options";  

// Configure Cloudinary  
cloudinary.config({  
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET,  
});  

// Step 1: Define the interface for the result  
interface CloudinaryResult {  
  public_id: string;  
  secure_url: string;  
  // Add other Cloudinary result fields as needed  
}  

export async function POST(request: NextRequest) {  
  try {  
    // Check authentication  
    const session = await getServerSession(authOptions);  
    if (!session) {  
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });  
    }  

    // Parse the form data  
    const formData = await request.formData();  
    const file = formData.get("file") as File;  

    if (!file) {  
      return NextResponse.json({ error: "No file provided" }, { status: 400 });  
    }  

    // Check file size (8 MB = 8 * 1024 * 1024 bytes)  
    const maxFileSize = 5 * 1024 * 1024;  
    if (file.size > maxFileSize) {  
      return NextResponse.json({ success: false, message: "File size exceeds 5 MB" }, { status: 400 });  
    }  

    // Convert file to buffer  
    const buffer = Buffer.from(await file.arrayBuffer());  

    // Upload to Cloudinary  
    const result = await new Promise<CloudinaryResult>((resolve, reject) => {  
      const uploadStream = cloudinary.uploader.upload_stream(  
        {  
          folder: "blog",  
        },  
        (error, uploadedResult) => {  
          if (error) {  
            reject(error);  
          } else {  
            resolve(uploadedResult as CloudinaryResult);  
          }  
        }  
      );  

      // Write the buffer to the upload stream  
      uploadStream.write(buffer);  
      uploadStream.end();  
    });  

    // Return the image details  
    return NextResponse.json({  
      success: true,  
      imageId: result.public_id,  
      url: result.secure_url,  
    });  
  } catch (error) {  
    console.error("Error uploading image:", error);  
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });  
  }  
}  