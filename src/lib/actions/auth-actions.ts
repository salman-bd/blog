"use server"
import { compare, hash } from "bcryptjs"
import { prisma } from "@/lib/db"
import { SignUpFormValues, signUpSchema } from "../validations"
import { sendPasswordResetEmail, sendVerificationEmail } from "../sendEmail"
import { generatePasswordResetToken, generateVerificationToken } from "../tokens"
import { UserRole } from "@prisma/client"


export async function signUp(data: SignUpFormValues, role: UserRole) {  
  try {  
    const { name, email, password, confirmPassword } = data;  

    // Validate inputs using your signup schema  
    const validationResult = signUpSchema.safeParse({  
      name,  
      email,  
      password,  
      confirmPassword,  
    });  

    if (!validationResult.success) {  
      return {  
        success: false,  
        message: "Invalid form data. Please check your inputs.",  
        errors: validationResult.error.flatten().fieldErrors,  
      };  
    }  

    // Check if user already exists  
    const existingUser = await prisma.user.findUnique({  
      where: {  
        email,  
      },  
    });  

    // Generate verification code  
    const verificationToken = await generateVerificationToken();  
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour  

    if (existingUser) {  
      if (existingUser.isVerified) {  
        return {  
          success: false,  
          message: "User with this email already exists. Go for signin",  
        };  
      }  
      
      // Update existing unverified user  
      const hashedPassword = await hash(password, 10);  
      await prisma.user.update({  
        where: {  
          id: existingUser.id,  
        },  
        data: {  
          name,  
          password: hashedPassword,  
          verificationToken,  
          verificationTokenExpires,  
        },  
      });  
      
      // Update associated Account entry for existing user or create it  
      await prisma.account.upsert({  
        where: {  
          provider_providerAccountId: { // Use the composite unique constraint  
            provider: 'credentials', // This is the provider type  
            providerAccountId: existingUser.id, // Assuming this is unique for the user  
          },  
        },  
        create: {  
          userId: existingUser.id,  
          type: 'credentials',  
          provider: 'credentials',  
          providerAccountId: existingUser.id, // This could be a unique identifier for the user  
          // Include default values for other optional fields if needed  
        },  
        update: {  
          // Include any updates necessary here, update tokens or other fields as needed  
          refresh_token: 'newRefreshToken', // Example of field to update  
          access_token: 'newAccessToken',  
          // You can also include other fields that may need updating  
        },  
      });   
    } else {  
      // Hash password  
      const hashedPassword = await hash(password, 10);  
      // Create user  
      const user = await prisma.user.create({  
        data: {  
          name,  
          email,  
          password: hashedPassword,  
          role,  
          verificationToken,  
          verificationTokenExpires,  
        },  
      });  
      // Create associated account for the new user  
      await prisma.account.create({  
        data: {  
          userId: user.id,  
          type: 'credentials',  
          provider: 'credentials',  
          providerAccountId: user.id, // Use user ID as providerAccountId  
        },  
      });  
    }  
    // Send verification email  
    const emailResult = await sendVerificationEmail(email, verificationToken);  
    if (!emailResult.success) {  
      console.error("Failed to send verification email:", emailResult.error);  
      // Continue with registration even if email fails  
    }  
    return {  
      success: true,  
      message: "Registration successful! Please check your email for the verification code.",  
      email,  
    };  

  } catch (error) {  
    console.error("Registration error:", error);  
    return {  
      success: false,  
      message: "An error occurred during registration. Please try again.",  
    };  
  }  
}  


export async function verifyEmail(token: string) {
  try {
    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return { success: false, message: "Invalid verification token" }
    }

    // Update user and mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    return { success: true, message: "Email verified successfully" }
  } catch (error) {
    console.error("Email verification error:", error)
    return { success: false, message: "Something went wrong during email verification" }
  }
}

export async function requestPasswordReset(email: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return { success: true, message: "If your email is registered, you will receive a password reset link" }
    }

    // Generate password reset token
    const resetToken = await generatePasswordResetToken(email)

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken)

    return { success: true, message: "Password reset instructions sent to your email" }
  } catch (error) {
    console.error("Password reset request error:", error)
    return { success: false, message: "Something went wrong. Please try again later" }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Find user with this reset token and check if it's still valid
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return { success: false, message: "Invalid or expired password reset token" }
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    return { success: true, message: "Password has been reset successfully" }
  } catch (error) {
    console.error("Password reset error:", error)
    return { success: false, message: "Something went wrong during password reset" }
  }
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.password) {
      return { success: false, message: "User not found or no password set" }
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return { success: false, message: "Current password is incorrect" }
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error("Update password error:", error)
    return { success: false, message: "Something went wrong during password update" }
  }
}