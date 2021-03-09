interface Fact {
  status: string
  fact?: {
    id: string
    text: string
    source: string
    source_url: string
    language: string
    permalink: string
  }
  error?: unknown
}