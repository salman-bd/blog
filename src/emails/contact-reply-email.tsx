import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface ContactReplyEmailProps {
  name: string
  userEmailSubject: string
  userEmailMessage: string
  message: string
}

export default function ContactReplyEmail({ name, userEmailSubject, userEmailMessage, message, }: ContactReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reply to your message: {userEmailSubject}</Preview>
      <Tailwind>
        <Body className="bg-stone-50 font-sans">
          <Container className="mx-auto p-4 max-w-xl">
            <Section className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <Heading className="text-xl font-bold text-amber-600 mb-4">Hello {name},</Heading>
              <Text className="text-stone-700 mb-4">
                Thank you for contacting us. This is a reply to your message regarding "{userEmailSubject}".
              </Text>

              {/* <Section className="bg-stone-100 p-4 rounded-md mb-4 border-l-4 border-amber-500">
                <Text className="text-stone-600 italic">Your original message:</Text>
                <Text className="text-stone-700">{userEmailMessage}</Text>
              </Section> */}

              <Text className="text-stone-700 mb-4">Our response:</Text>
              <Text className="text-stone-700 whitespace-pre-line mb-6">{message}</Text>

              <Hr className="border-stone-200 my-6" />

              <Text className="text-stone-600 text-sm">
                If you have any further questions, please don't hesitate to contact us again.
              </Text>
              <Text className="text-stone-600 text-sm">Best regards,</Text>
              <Text className="text-stone-700 font-medium">The Junayed Ahmed Blog Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
