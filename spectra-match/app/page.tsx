import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="animate-fade-in space-y-8 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
          Find Your <span className="gradient-text">Perfect Spectral</span> Match.
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          More than just a swipe. We use deep psychological dimensions to analyze
          exactly how your energy aligns with others.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/test" className="btn btn-primary px-10 py-4 text-lg">
            Discover Your Type
          </Link>
          <Link href="/matches" className="btn btn-ghost px-10 py-4 text-lg">
            View Matches
          </Link>
        </div>
      </div>
    </div>
  )
}
