import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Junayed Ahmed",
  description: "Terms of service for Junayed Ahmed's personal blog.",
}

export default function TermsOfServicePage() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <Card>
        <CardContent className="p-6 prose prose-stone dark:prose-invert max-w-none">
          <p>Last updated: April 21, 2024</p>

          <h2>Introduction</h2>
          <p>
            Welcome to Junayed Ahmed's Blog. These terms and conditions outline the rules and regulations for the use of
            my website.
          </p>
          <p>
            By accessing this website, I assume you accept these terms and conditions in full. Do not continue to use
            Junayed Ahmed's Blog if you do not accept all of the terms and conditions stated on this page.
          </p>

          <h2>License</h2>
          <p>
            Unless otherwise stated, Junayed Ahmed and/or its licensors own the intellectual property rights for all
            material on Junayed Ahmed's Blog. All intellectual property rights are reserved. You may view and/or print
            pages from the website for your own personal use subject to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from this website</li>
            <li>Sell, rent, or sub-license material from this website</li>
            <li>Reproduce, duplicate, or copy material from this website</li>
            <li>
              Redistribute content from Junayed Ahmed's Blog (unless content is specifically made for redistribution)
            </li>
          </ul>

          <h2>User Comments</h2>
          <p>
            Certain parts of this website offer the opportunity for users to post and exchange opinions, information,
            material, and data ('Comments') in areas of the website. I do not screen, edit, publish, or review Comments
            prior to their appearance on the website, and Comments do not reflect my views or opinions. Comments reflect
            the view and opinion of the person who posts such view or opinion.
          </p>
          <p>You are responsible for:</p>
          <ul>
            <li>Ensuring that any Comments you post comply with these Terms and Conditions</li>
            <li>
              Ensuring that any Comments you post do not infringe any third-party legal rights (including copyright,
              trademark, privacy, or other personal or proprietary right)
            </li>
            <li>
              Ensuring that any Comments you post are not illegal, obscene, defamatory, threatening, invasive of
              privacy, or otherwise injurious to third parties
            </li>
            <li>
              Ensuring that any Comments you post do not contain software viruses, political campaigning, commercial
              solicitation, chain letters, mass mailings, or any form of 'spam'
            </li>
          </ul>

          <h2>Hyperlinking to my Content</h2>
          <p>The following organizations may link to my website without prior written approval:</p>
          <ul>
            <li>Government agencies</li>
            <li>Search engines</li>
            <li>News organizations</li>
            <li>
              Online directory distributors when they list me in the directory may link to my website in the same manner
              as they hyperlink to the websites of other listed businesses
            </li>
            <li>
              Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and
              charity fundraising groups which may not hyperlink to my website
            </li>
          </ul>

          <h2>Reservation of Rights</h2>
          <p>
            I reserve the right at any time and in my sole discretion to request that you remove all links or any
            particular link to my website. You agree to immediately remove all links to my website upon such request.
          </p>

          <h2>Content Liability</h2>
          <p>
            I shall have no responsibility or liability for any content appearing on your website. You agree to
            indemnify and defend me against all claims arising out of or based upon your website. No link(s) may appear
            on any page on your website or within any context containing content or materials that may be interpreted as
            libelous, obscene, or criminal, or which infringes, otherwise violates, or advocates the infringement or
            other violation of, any third party rights.
          </p>

          <h2>Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, I exclude all representations, warranties, and conditions
            relating to my website and the use of this website (including, without limitation, any warranties implied by
            law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).
          </p>

          <h2>Changes to Terms</h2>
          <p>
            I may revise these terms of service for my website at any time without notice. By using this website, you
            are agreeing to be bound by the current version of these terms of service.
          </p>

          <h2>Contact</h2>
          <p>If you have any questions about these Terms of Service, please contact me at: junayed@example.com</p>
        </CardContent>
      </Card>
    </div>
  )
}
