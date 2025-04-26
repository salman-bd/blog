import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { sriracha } from "@/components/ui/font"

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 ">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl space-y-4">
            <span className={`block ${sriracha.className} text-amber-600`}>Welcome to My Blog</span>
            <span className={`block ${sriracha.className}`}>Exploring Life's Journey</span>  
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-prose">
            Join me as I share my experiences and thoughts on travel, politics, religion, history, and the beauty of
            nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/blog">Read My Blog</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800"
            >
              <Link href="/about">About Me</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/blogger2.jpg?height=400&width=600"
            alt="Junayed Ahmed"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
