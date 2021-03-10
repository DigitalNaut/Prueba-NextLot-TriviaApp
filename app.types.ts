export interface IFact {
  status: string
  fact?: {
    _id: string
    text: string
    source: string
    source_url: string
    language: string
    permalink: string
  }
  error?: unknown
}