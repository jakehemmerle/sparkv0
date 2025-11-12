import { encoding_for_model } from 'tiktoken'
import type { Segment } from './transcription'

const encoding = encoding_for_model('gpt-4o')

export function countTokens(text: string): number {
  return encoding.encode(text).length
}

export function countTranscriptTokens(segments: Segment[]): number {
  const fullText = segments.map(s => `${s.speaker}: ${s.text}`).join('\n')
  return countTokens(fullText)
}
