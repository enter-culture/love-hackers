import { useTypewriter } from '@/lib/game/useTypewriter';
import type { RotationCharacter } from '@/lib/game/types';

/* 캐릭터별 ACNH 사인 색상 */
const CHAR_COLOR: Record<string, { bg: string; border: string; text: string; emoji: string }> = {
  eevee:   { bg: '#C8A0E8', border: '#9060B8', text: '#fff',     emoji: '🌸' },
  pikachu: { bg: '#FFD740', border: '#C8A000', text: '#3D2810',  emoji: '⚡' },
  lucario: { bg: '#6B9ECC', border: '#3A6898', text: '#fff',     emoji: '💎' },
};

const DEFAULT_COLOR = { bg: '#F9A916', border: '#C47000', text: '#fff', emoji: '✨' };

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
  const color = CHAR_COLOR[character.id] ?? DEFAULT_COLOR;

  /* 표시할 텍스트: 반응 > 질문 */
  const activeText = reaction ?? (!isLoading ? question : '');
  const { displayed, isDone } = useTypewriter(activeText, 30);

  /* 선택지 표시 조건 */
  const showChoices = isDone && !reaction && !isLoading && chosenIndex === null;

  return (
    <div
      className="px-3 pb-5 pt-0"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── 선택지 패널 (말풍선 위에 나타남) ── */}
      {showChoices && (
        <div className="ac-choices-box mb-3 mx-auto" style={{ maxWidth: 340 }}>
          {choices.map((choice, i) => (
            <button
              key={i}
              className="ac-choice-row w-full"
              onClick={() => onChoose(i, choice)}
            >
              {/* AC 커서 아이콘 */}
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ background: color.bg, border: `2px solid ${color.border}`, color: color.text }}
              >
                {['①', '②', '③'][i]}
              </span>
              <span>{choice}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── 메인 말풍선 ── */}
      <div className="ac-dialogue-box px-5 pt-6 pb-4 mx-auto" style={{ maxWidth: 340, position: 'relative' }}>
        {/* 이름 태그 */}
        <div
          className="ac-nametag absolute"
          style={{
            top: -18,
            left: 18,
            background: color.bg,
            borderColor: color.border,
            color: color.text,
          }}
        >
          <span>{color.emoji}</span>
          <span>{character.displayName}</span>
        </div>

        {/* 포켓몬 픽셀 아이콘 (우측 상단 장식) */}
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${character.pokemonId}.png`}
          alt=""
          className="absolute pointer-events-none"
          style={{
            width: 52,
            height: 52,
            right: 10,
            top: -26,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
          }}
        />

        {/* 내용 */}
        <div className="min-h-[56px] flex items-end justify-between gap-3">
          {isLoading ? (
            /* 로딩 점 세개 */
            <div className="flex items-center gap-2 pb-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: color.bg,
                    animation: `ac-dot-bounce 0.9s ease-in-out ${i * 0.18}s infinite`,
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm font-700 leading-relaxed flex-1" style={{ color: 'var(--ac-text)' }}>
                {displayed}
                {/* 타이핑 커서 */}
                {!isDone && (
                  <span
                    className="inline-block w-0.5 h-4 ml-0.5 align-middle rounded-sm"
                    style={{ background: color.bg, animation: 'pulse 0.8s step-end infinite' }}
                  />
                )}
              </p>

              {/* 계속 화살표 */}
              {isDone && (
                <span
                  className="text-base flex-shrink-0 pb-0.5"
                  style={{ color: color.border, animation: 'ac-arrow-bounce 0.7s ease-in-out infinite' }}
                >
                  ▼
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
