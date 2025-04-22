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
 
  interface User {  
    id: string
    email: string
    name: string
    isVerified: boolean
    image?: string
    role: string
  }  

}