import client from './assemblyai'
import prisma from './database'

export interface Segment {
  speaker: string  // 'A', 'B', etc from AssemblyAI
  text: string
  start: number    // milliseconds
  end: number      // milliseconds
}

// Submit transcription (non-blocking)
export async function submitTranscription(filePath: string): Promise<string> {
  const transcript = await client.transcripts.submit({
    audio: filePath,
    speaker_labels: true  // Enable diarization
  })
  return transcript.id
}

// Get transcription status
export async function getTranscriptionStatus(transcriptId: string) {
  return await client.transcripts.get(transcriptId)
}

// Parse utterances to segments
export function parseUtterances(transcript: any): Segment[] {
  if (!transcript.utterances || transcript.utterances.length === 0) {
    return []
  }
  
  return transcript.utterances.map((u: any) => ({
    speaker: u.speaker,
    text: u.text,
    start: u.start,
    end: u.end
  }))
}

// Process completed transcript and store in database
export async function processCompletedTranscript(sessionId: string, transcript: any) {
  const segments = parseUtterances(transcript)
  
  // Create transcript record
  await prisma.transcript.create({
    data: {
      sessionId,
      segments: JSON.stringify(segments),
      speakerAIsJake: true  // Default assumption
    }
  })
  
  // Calculate token count (will be implemented in SPK-15)
  let tokenCount = 0
  try {
    const { countTranscriptTokens } = await import('./tokens')
    tokenCount = countTranscriptTokens(segments)
  } catch (err) {
    console.log('Token counting not yet available')
  }
  
  // Update session
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: 'ready',
      duration: Math.round((transcript.audio_duration || 0) * 1000),  // convert to ms
      tokenCount
    }
  })
}
