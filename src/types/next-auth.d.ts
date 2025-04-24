// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";  

// Extend the NextAuth types  
declare module "next-auth" {  
  interface Session {  
    user: {
      id: string
      email: string
      name: string
      isVerified: boolean
      image?: string
      role: string
    };  
  }  
 
  interface User extends DefaultUser {  
    id: string
    email: string
    name: string
    isVerified: boolean
    image?: string
    role: string
  }  

}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    isVerified: boolean
  }
}