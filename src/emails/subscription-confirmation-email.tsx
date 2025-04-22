import { Tailwind } from "@react-email/tailwind"
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

interface SubscriptionConfirmationEmailProps {
  email: string
  unsubscribeUrl: string
}

export function SubscriptionConfirmationEmail({ email, unsubscribeUrl }: SubscriptionConfirmationEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Welcome to Junayed Ahmed's Newsletter</Preview>
        <Body className="bg-stone-50 font-sans">
          <Container className="bg-white p-8 rounded-lg shadow-sm my-8 mx-auto max-w-md">
            <Heading className="text-2xl font-bold text-amber-600 text-center mb-4">Junayed Ahmed's Blog</Heading>
            <Text className="text-stone-600 mb-4">Thank you for subscribing to our newsletter!</Text>
            <Text className="text-stone-600 mb-4">
              You'll now receive updates about new blog posts, travel stories, and other interesting content directly to
              your inbox at <strong>{email}</strong>.
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
              If you ever wish to unsubscribe, you can do so by clicking the link below:
            </Text>
            <Section className="text-center mb-4">
              <Button className="text-amber-600 underline" href={unsubscribeUrl}>
                Unsubscribe from newsletter
              </Button>
            </Section>
            <Text className="text-stone-600 mb-4">
              Best regards,
              <br />
              Junayed Ahmed
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
