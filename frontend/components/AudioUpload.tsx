'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'

export default function AudioUpload() {
  const router = useRouter()
  const uploadSession = useSessionStore((state) => state.uploadSession)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // Validate M4A format
    if (!file.name.toLowerCase().endsWith('.m4a')) {
      setError('Only M4A audio files are allowed')
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const session = await uploadSession(file, (progress) => {
        setProgress(Math.round(progress))
      })
      
      // Navigate to sessions list after successful upload
      router.push('/sessions')
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
      setUploading(false)
      setProgress(0)
    }
  }, [uploadSession, router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/m4a': ['.m4a'],
      'audio/x-m4a': ['.m4a'],
      'audio/mp4': ['.m4a']
    },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-700">
              Uploading... {progress}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-600">
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the M4A file here</p>
              ) : (
                <>
                  <p className="text-lg font-medium">
                    Drag and drop an M4A audio file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to select a file
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400">
              M4A format only, up to 100MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
