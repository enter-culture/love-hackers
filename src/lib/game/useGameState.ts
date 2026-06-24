import { useCallback, useState } from 'react';

import { CHARACTERS } from './characters';
import type { CharacterResult, ConversationRecord, Exchange, GameStep, RotationCharacter } from './types';

interface GameState {
  step: GameStep;
  currentCharacter: RotationCharacter;
  currentCharacterIndex: number;
  conversations: ConversationRecord[];
  results: CharacterResult[];
}

interface GameActions {
  startGame: () => void;
  addExchange: (characterId: string, exchange: Exchange) => void;
  advanceCharacter: () => void;
  setResults: (results: CharacterResult[]) => void;
  restartGame: () => void;
}

export function useGameState(): GameState & GameActions {
  const [step, setStep] = useState<GameStep>('lobby');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [results, setResults] = useState<CharacterResult[]>([]);

  const startGame = useCallback(() => {
    setStep('rotation');
    setCurrentCharacterIndex(0);
    setConversations([]);
    setResults([]);
  }, []);

  const addExchange = useCallback((characterId: string, exchange: Exchange) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.characterId === characterId);
      if (existing) {
        return prev.map((c) =>
          c.characterId === characterId ? { ...c, exchanges: [...c.exchanges, exchange] } : c,
        );
      }
      return [...prev, { characterId, exchanges: [exchange] }];
    });
  }, []);

  const advanceCharacter = useCallback(() => {
    setCurrentCharacterIndex((prev) => {
      if (prev < CHARACTERS.length - 1) {
        return prev + 1;
      }
      setStep('result');
      return prev;
    });
  }, []);

  const restartGame = useCallback(() => {
    setStep('lobby');
    setCurrentCharacterIndex(0);
    setConversations([]);
    setResults([]);
  }, []);

  return {
    step,
    currentCharacter: CHARACTERS[currentCharacterIndex],
    currentCharacterIndex,
    conversations,
    results,
    startGame,
    addExchange,
    advanceCharacter,
    setResults,
    restartGame,
  };
}
