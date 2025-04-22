import ContactPageClient from "./ContactPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Junayed Ahmed",
  description: "Get in touch with Junayed Ahmed for inquiries, collaborations, or just to say hello.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
