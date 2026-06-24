import { createFileRoute } from '@tanstack/react-router';

import { LobbyView } from '@/components/game/LobbyView';
import { ResultView } from '@/components/game/ResultView';
import { RotationView } from '@/components/game/RotationView';
import { CHARACTERS } from '@/lib/game/characters';
import { useGameState } from '@/lib/game/useGameState';
import type { CharacterResult, Exchange } from '@/lib/game/types';

export const Route = createFileRoute('/game')({
  head: () => ({
    meta: [{ title: '로테이션 소개팅 — Love Hackers' }],
  }),
  component: GamePage,
});

function GamePage() {
  const {
    step,
    currentCharacter,
    currentCharacterIndex,
    conversations,
    results,
    startGame,
    addExchange,
    advanceCharacter,
    setResults,
    restartGame,
  } = useGameState();

  const handleRotationComplete = (exchanges: Exchange[]) => {
    exchanges.forEach((e) => addExchange(currentCharacter.id, e));
    advanceCharacter();
  };

  const handleResultsReady = (ready: CharacterResult[]) => {
    setResults(ready);
  };

  if (step === 'lobby') {
    return <LobbyView onStart={startGame} />;
  }

  if (step === 'rotation') {
    return (
      <div className="relative w-full h-screen overflow-hidden" key={currentCharacter.id}>
        {/* 상단 진행 표시 */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-center gap-2 pt-3.5"
          style={{ zIndex: 50 }}
        >
          {CHARACTERS.map((c, i) => (
            <div
              key={c.id}
              className="rounded-full"
              style={{
                width: 40,
                height: 4,
                background:
                  i < currentCharacterIndex
                    ? '#f59e0b'
                    : i === currentCharacterIndex
                      ? 'rgba(245,158,11,0.45)'
                      : 'rgba(255,255,255,0.1)',
                transition: 'background 0.4s',
              }}
            />
          ))}
        </div>

        <RotationView character={currentCharacter} onComplete={handleRotationComplete} />
      </div>
    );
  }

  return (
    <ResultView
      conversations={conversations}
      cachedResults={results}
      onResultsReady={handleResultsReady}
      onRestart={restartGame}
    />
  );
}
