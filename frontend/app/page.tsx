import Link from 'next/link'
import AudioUpload from '@/components/AudioUpload'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Spark</h1>
          <p className="text-xl text-gray-600">
            Conversation Transcription & Analysis
          </p>
        </div>

        <div className="mb-8">
          <AudioUpload />
        </div>

        <div className="text-center">
          <Link
            href="/sessions"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            View all sessions
          </Link>
        </div>
      </div>
    </main>
  )
}
