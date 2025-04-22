import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Junayed Ahmed",
  description:
    "Learn more about Junayed Ahmed, a government employee in Bangladesh with a passion for travel and writing.",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-amber-600">About</span> Me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 prose prose-stone dark:prose-invert max-w-none">
              <h2>Who I Am</h2>
              <p>
                I'm Junayed Ahmed, a government employee in Bangladesh with a passion for traveling and exploring new
                places. Born in Kishoregonj district under Dhaka division, I completed my bachelor's and master's
                degrees in Economics from MC College in Sylhet, Bangladesh.
              </p>

              <p>
                My interests span across various domains including travel, politics, religion, history, and nature.
                Through this blog, I aim to share my experiences and insights on these topics, hoping to connect with
                like-minded individuals and inspire others to explore the world around them.
              </p>

              <h2>My Journey</h2>
              <p>
                My journey as a writer began several years ago when I started documenting my travels across Bangladesh.
                What started as personal notes soon evolved into detailed accounts that I shared with friends and
                family. The positive feedback I received encouraged me to start this blog and share my experiences with
                a wider audience.
              </p>

              <p>
                As a government employee, I've had the opportunity to work in different parts of Bangladesh, which has
                given me unique insights into the diverse cultures, traditions, and landscapes of this beautiful
                country. These experiences have significantly shaped my perspective and enriched my writing.
              </p>

              <h2>My Writing</h2>
              <p>
                On this blog, you'll find a variety of content ranging from travel guides and political analyses to
                reflections on religious practices and historical events. I strive to present balanced and thoughtful
                perspectives, drawing from both personal experiences and research.
              </p>

              <p>
                I believe in the power of storytelling to bridge gaps between different cultures and communities.
                Through my writing, I hope to contribute to greater understanding and appreciation of the rich tapestry
                of human experiences.
              </p>

              <h2>Connect With Me</h2>
              <p>
                I'm always eager to connect with readers and fellow enthusiasts. Whether you have questions,
                suggestions, or just want to share your own experiences, feel free to reach out through the contact page
                or social media.
              </p>

              <p>
                Thank you for visiting my blog. I hope you find the content here informative, engaging, and perhaps even
                inspiring for your own journeys.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative h-80 w-full mb-4 rounded-md overflow-hidden">
                <Image src="/junayed.jpg?height=320&width=240" alt="Junayed Ahmed" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-2">Junayed Ahmed</h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                Government Employee | Travel Enthusiast | Writer
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Location:</span> Dhaka, Bangladesh
                </div>
                <div>
                  <span className="font-medium">Education:</span> Master's in Economics
                </div>
                <div>
                  <span className="font-medium">Languages:</span> Bengali, English
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Areas of Interest</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mr-2"></div>
                  <span>Travel and Exploration</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mr-2"></div>
                  <span>South Asian Politics</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mr-2"></div>
                  <span>Religious Studies</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mr-2"></div>
                  <span>Bangladesh History</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mr-2"></div>
                  <span>Nature and Wildlife</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mr-2"></div>
                  <span>Photography</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
