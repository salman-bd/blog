import { Tailwind } from "@react-email/tailwind"
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface VerificationEmailProps {
  verificationUrl: string
}

export function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Verify your email address for Junayed Ahmed's Blog</Preview>
        <Body className="bg-stone-50 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-8 mx-auto max-w-md">
            <Heading className="text-2xl font-bold text-amber-600 text-center mb-4">Junayed Ahmed's Blog</Heading>
            <Text className="text-stone-600 mb-4">
              Thanks for signing up! Please verify your email address to complete your registration.
            </Text>
            <Section className="text-center mb-8">
              <Button className="bg-amber-600 text-white px-6 py-3 rounded-md font-medium" href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>
            <Text className="text-stone-500 text-sm mb-4">
              If you didn't sign up for an account, you can safely ignore this email.
            </Text>
            <Hr className="border-stone-200 my-4" />
            <Text className="text-stone-400 text-xs text-center">
              &copy; {new Date().getFullYear()} Junayed Ahmed's Blog. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
