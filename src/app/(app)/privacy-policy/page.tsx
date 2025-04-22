import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Junayed Ahmed",
  description: "Privacy policy for Junayed Ahmed's personal blog.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <Card>
        <CardContent className="p-6 prose prose-stone dark:prose-invert max-w-none">
          <p>Last updated: April 21, 2024</p>

          <h2>Introduction</h2>
          <p>
            Welcome to Junayed Ahmed's Blog. I respect your privacy and am committed to protecting your personal data.
            This privacy policy will inform you about how I look after your personal data when you visit my website and
            tell you about your privacy rights and how the law protects you.
          </p>

          <h2>The Data I Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can
            be identified. I may collect, use, store, and transfer different kinds of personal data about you which I
            have grouped together as follows:
          </p>
          <ul>
            <li>
              <strong>Identity Data</strong> includes first name, last name, username, or similar identifier.
            </li>
            <li>
              <strong>Contact Data</strong> includes email address and telephone numbers.
            </li>
            <li>
              <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and
              version, time zone setting and location, browser plug-in types and versions, operating system and
              platform, and other technology on the devices you use to access this website.
            </li>
            <li>
              <strong>Usage Data</strong> includes information about how you use my website.
            </li>
          </ul>

          <h2>How I Collect Your Personal Data</h2>
          <p>I use different methods to collect data from and about you including through:</p>
          <ul>
            <li>
              <strong>Direct interactions.</strong> You may give me your Identity and Contact Data by filling in forms
              or by corresponding with me by post, phone, email, or otherwise.
            </li>
            <li>
              <strong>Automated technologies or interactions.</strong> As you interact with my website, I may
              automatically collect Technical Data about your equipment, browsing actions, and patterns.
            </li>
            <li>
              <strong>Third parties or publicly available sources.</strong> I may receive personal data about you from
              various third parties and public sources.
            </li>
          </ul>

          <h2>How I Use Your Personal Data</h2>
          <p>
            I will only use your personal data when the law allows me to. Most commonly, I will use your personal data
            in the following circumstances:
          </p>
          <ul>
            <li>Where I need to perform the contract I am about to enter into or have entered into with you.</li>
            <li>
              Where it is necessary for my legitimate interests and your interests and fundamental rights do not
              override those interests.
            </li>
            <li>Where I need to comply with a legal obligation.</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            I have put in place appropriate security measures to prevent your personal data from being accidentally
            lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, I limit access to your
            personal data to those employees, agents, contractors, and other third parties who have a business need to
            know.
          </p>

          <h2>Data Retention</h2>
          <p>
            I will only retain your personal data for as long as reasonably necessary to fulfill the purposes I
            collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or
            reporting requirements.
          </p>

          <h2>Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data.
            These include the right to:
          </p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer by websites that you visit. They are widely
            used in order to make websites work, or work more efficiently, as well as to provide information to the
            owners of the site. Most web browsers allow some control of most cookies through the browser settings.
          </p>

          <h2>Changes to the Privacy Policy</h2>
          <p>
            I may update this privacy policy from time to time. I will notify you of any changes by posting the new
            privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this privacy policy or my privacy practices, please contact me at:
            junayed@example.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
