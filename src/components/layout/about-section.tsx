import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function AboutSection() {
  return (
    <section className="py-12 md:py-20 bg-stone-50 dark:bg-stone-900 rounded-lg my-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden order-2 md:order-1">
            <Image src="/junayed.jpg?height=400&width=600" alt="Junayed Ahmed" fill className="object-cover" />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="block text-amber-600">About Me</span>
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              I'm Junayed Ahmed, a government employee in Bangladesh with a passion for traveling and exploring new
              places. Born in Kishoregonj district under Dhaka division, I completed my bachelor's and master's degrees
              in Economics from MC College in Sylhet, Bangladesh.
            </p>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              My interests span across various domains including travel, politics, religion, history, and nature.
              Through this blog, I aim to share my experiences and insights on these topics.
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/about">Learn More About Me</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
