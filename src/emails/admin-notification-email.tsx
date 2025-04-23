import { Tailwind } from "@react-email/tailwind"
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface AdminNotificationEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export function AdminNotificationEmail({ name, email, subject, message }: AdminNotificationEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>New contact form submission from {name}</Preview>
        <Body className="bg-stone-50 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-8 mx-auto max-w-md">
            <Heading className="text-2xl font-bold text-amber-600 text-center mb-4">
              New Contact Form Submission
            </Heading>
            <Text className="text-stone-600 mb-4">You have received a new message from your blog's contact form.</Text>
            <Section className="bg-stone-50 p-4 rounded-md mb-4">
              <Text className="text-stone-600 mb-2">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="text-stone-600 mb-2">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="text-stone-600 mb-2">
                <strong>Subject:</strong> {subject}
              </Text>
              <Text className="text-stone-600 mb-2">
                <strong>Message:</strong>
              </Text>
              <Text className="text-stone-600 bg-white p-3 rounded border border-stone-200 mb-0">{message}</Text>
            </Section>
            <Text className="text-stone-600 mb-4">Please respond to this inquiry at your earliest convenience.</Text>
            <Hr className="border-stone-200 my-4" />
            <Text className="text-stone-400 text-xs text-center">
              &copy; {new Date().getFullYear()} Blogger's Blog. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
