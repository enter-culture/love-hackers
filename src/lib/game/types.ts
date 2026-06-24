export type GameStep = 'intro' | 'lobby' | 'rotation' | 'result';

export interface Exchange {
  question: string;
  choices: [string, string, string];
  chosenIndex: number;
  reaction: string;
}

export interface ConversationRecord {
  characterId: string;
  exchanges: Exchange[];
}

export interface CharacterResult {
  characterId: string;
  reaction: string;
  heartScore: number;
}

export interface RotationCharacter {
  id: string;
  pokemonId: number;
  displayName: string;
  personality: string;
  systemPrompt: string;
}
