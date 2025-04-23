import { Tailwind } from "@react-email/tailwind"
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface ContactConfirmationEmailProps {
  name: string
  subject: string
}

export function ContactConfirmationEmail({ name, subject }: ContactConfirmationEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Thank you for contacting Blogger's Blog</Preview>
        <Body className="bg-stone-50 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-8 mx-auto max-w-md">
            <Heading className="text-2xl font-bold text-amber-600 text-center mb-4">Blogger's Blog</Heading>
            <Text className="text-stone-600 mb-4">Hi {name},</Text>
            <Text className="text-stone-600 mb-4">
              Thank you for reaching out to us. We have received your message regarding "{subject}".
            </Text>
            <Text className="text-stone-600 mb-4">
              We appreciate your interest and will get back to you as soon as possible. Please allow us 1-2 business
              days to respond.
            </Text>
            <Section className="text-center mb-8">
              <Button
                className="bg-amber-600 text-white px-6 py-3 rounded-md font-medium"
                href={process.env.NEXT_PUBLIC_APP_URL}
              >
                Visit Our Blog
              </Button>
            </Section>
            <Text className="text-stone-600 mb-4">
              Best regards,
              <br />
              Blogger
            </Text>
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
