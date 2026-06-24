import type { RotationCharacter } from '@/lib/game/types';

interface DialoguePanelProps {
  character: RotationCharacter;
  question: string;
  choices: [string, string, string];
  onChoose: (index: number, chosenText: string) => void;
  isLoading: boolean;
  chosenIndex: number | null;
  reaction: string | null;
}

export function DialoguePanel({
  character,
  question,
  choices,
  onChoose,
  isLoading,
  chosenIndex,
  reaction,
}: DialoguePanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 pt-0" style={{ zIndex: 20 }}>
      {/* 말풍선 */}
      <div
        className="relative rounded-2xl p-5 mb-3"
        style={{
          background: 'rgba(10, 6, 3, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,180,60,0.2)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,100,0.08)',
        }}
      >
        <p className="text-xs font-semibold mb-2 tracking-wide" style={{ color: '#f59e0b' }}>
          {character.displayName}
        </p>

        {isLoading ? (
          <div className="flex gap-1.5 items-center h-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#f59e0b',
                  animation: `game-float 0.9s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        ) : reaction ? (
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#f0ebe0', animation: 'game-fade-in-up 0.4s ease both' }}
          >
            {reaction}
          </p>
        ) : (
          <p className="text-base font-medium leading-snug" style={{ color: '#f5f0e8' }}>
            {question}
          </p>
        )}
      </div>

      {/* 선택지 버튼 */}
      {!reaction && !isLoading && (
        <div className="flex flex-col gap-2.5">
          {choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoose(i, choice)}
              disabled={chosenIndex !== null}
              className="w-full py-3.5 px-5 rounded-xl text-sm font-semibold text-left transition-all"
              style={{
                background:
                  chosenIndex === i
                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                    : 'rgba(255,255,255,0.07)',
                border: `1px solid ${chosenIndex === i ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                color: chosenIndex === i ? '#fff' : '#e0d8cc',
                backdropFilter: 'blur(12px)',
                boxShadow:
                  chosenIndex === i ? '0 4px 20px rgba(245,158,11,0.4)' : 'none',
                transform: chosenIndex === i ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <span className="mr-2 opacity-50">{['①', '②', '③'][i]}</span>
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
