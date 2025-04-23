import { Tailwind } from "@react-email/tailwind"
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface WelcomeEmailProps {
  name: string
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Welcome to Blogger's Blog</Preview>
        <Body className="bg-stone-50 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-8 mx-auto max-w-md">
            <Heading className="text-2xl font-bold text-amber-600 text-center mb-4">Blogger's Blog</Heading>
            <Text className="text-stone-600 mb-4">Hi {name},</Text>
            <Text className="text-stone-600 mb-4">
              Welcome to Blogger's Blog! I'm excited to have you join our community.
            </Text>
            <Text className="text-stone-600 mb-4">
              On this blog, I share my thoughts and experiences on travel, politics, religion, history, and nature. I
              hope you'll find the content interesting and engaging.
            </Text>
            <Section className="text-center mb-8">
              <Button
                className="bg-amber-600 text-white px-6 py-3 rounded-md font-medium"
                href={process.env.NEXT_PUBLIC_APP_URL}
              >
                Visit the Blog
              </Button>
            </Section>
            <Text className="text-stone-600 mb-4">
              Feel free to explore the blog and leave comments on posts that interest you.
            </Text>
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
