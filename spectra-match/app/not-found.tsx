import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <h1 className="text-4xl font-bold">Spectral Anomaly Detected (404)</h1>
      <p className="text-text-secondary">Next.js is running, but this specific frequency doesn't exist.</p>
      <div className="space-y-2">
         <p>Try visiting:</p>
         <div className="flex gap-4 justify-center">
           <Link href="/" className="text-primary hover:underline">Home</Link>
           <Link href="/test" className="text-primary hover:underline">Test</Link>
           <Link href="/login" className="text-primary hover:underline">Login</Link>
         </div>
      </div>
      <Link href="/" className="btn btn-primary mt-8">Return to Origin</Link>
    </div>
  )
}
