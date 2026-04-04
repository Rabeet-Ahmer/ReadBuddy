'use client'

import Image from "next/image"
import Link from "next/link"

const steps = [
  { number: 1, title: "Upload PDF", description: "Add your book file" },
  { number: 2, title: "AI Processing", description: "We analyze the content" },
  { number: 3, title: "Voice Chat", description: "Discuss with AI" },
]

const HeroSection = () => {
  return (
    <section className="library-hero-card mb-10 md:mb-16">
      <div className="library-hero-content">
        {/* Left – Heading, description, CTA */}
        <div className="library-hero-text">
          <h1 className="library-hero-title">Your Library</h1>
          <p className="library-hero-description">
            Convert your books into interactive AI conversations.
            Listen, learn, and discuss your favorite reads.
          </p>
          <Link href="/books/new" className="library-cta-primary">
            + Add new book
          </Link>
        </div>

        {/* Center – Illustration (mobile) */}
        <div className="library-hero-illustration">
          <Image
            src="/assets/hero-illustration.png"
            alt="Vintage books, globe, and desk lamp illustration"
            width={280}
            height={210}
            className="object-contain"
            priority
          />
        </div>

        {/* Center – Illustration (desktop) */}
        <div className="library-hero-illustration-desktop">
          <Image
            src="/assets/hero-illustration.png"
            alt="Vintage books, globe, and desk lamp illustration"
            width={340}
            height={255}
            className="object-contain"
          />
        </div>

        {/* Right – Steps card */}
        <div className="hidden lg:block">
          <div className="library-steps-card">
            <div className="flex flex-col gap-5">
              {steps.map(({ number, title, description }) => (
                <div key={number} className="library-step-item">
                  <div className="library-step-number">{number}</div>
                  <div className="flex flex-col">
                    <span className="library-step-title">{title}</span>
                    <span className="library-step-description">{description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
