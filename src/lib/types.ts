export interface Character {
  id: string
  displayName: string
  color: string
  accentColor: string
  model?: string
}

export interface Question {
  question: string
  choices: [string, string, string]
  scores: [number, number, number]
}

export interface GameScore {
  characterId: string
  score: number
  maxScore: number
}
