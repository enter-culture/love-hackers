import { useEffect, useState } from 'react';

import { generateResultFn } from '@/lib/game.functions';
import { CHARACTERS } from '@/lib/game/characters';
import type { CharacterResult, ConversationRecord } from '@/lib/game/types';

import { PokemonSprite } from './PokemonSprite';

interface HeartGaugeProps {
  score: number;
}

function HeartGauge({ score }: HeartGaugeProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 500);
    return () => clearTimeout(t);
  }, [score]);

  const color =
    score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : score >= 40 ? '#84cc16' : '#64748b';

  return (
    <div className="mt-2.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: 'rgba(240,235,220,0.45)' }}>
          궁합도
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  );
}

interface ResultViewProps {
  conversations: ConversationRecord[];
  cachedResults: CharacterResult[];
  onResultsReady: (results: CharacterResult[]) => void;
  onRestart: () => void;
}

export function ResultView({ conversations, cachedResults, onResultsReady, onRestart }: ResultViewProps) {
  const [results, setResults] = useState<CharacterResult[]>(cachedResults);
  const [isLoading, setIsLoading] = useState(cachedResults.length === 0);

  useEffect(() => {
    if (cachedResults.length > 0) return;

    const generate = async () => {
      const generated = await Promise.all(
        CHARACTERS.map(async (c) => {
          const conv = conversations.find((cv) => cv.characterId === c.id);
          const exchanges = (conv?.exchanges ?? []).map((e) => ({
            question: e.question,
            chosen: e.choices[e.chosenIndex],
            reaction: e.reaction,
          }));

          try {
            const res = await generateResultFn({ data: { character: c, exchanges } });
            return { characterId: c.id, reaction: res.reaction, heartScore: res.heartScore };
          } catch {
            return { characterId: c.id, reaction: '또 만나고 싶어!', heartScore: 65 };
          }
        }),
      );

      setResults(generated);
      onResultsReady(generated);
      setIsLoading(false);
    };

    generate();
  }, [conversations, cachedResults, onResultsReady]);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center px-4 py-14"
      style={{ background: 'linear-gradient(180deg, #080402 0%, #100806 100%)' }}
    >
      {/* 헤더 */}
      <div className="text-center mb-8 game-entrance">
        <p className="text-4xl mb-3">✨</p>
        <h2 className="text-2xl font-bold" style={{ color: '#f5f0e8' }}>
          오늘의 소개팅 결과
        </h2>
        <p className="text-sm mt-1.5" style={{ color: 'rgba(240,235,220,0.4)' }}>
          상대방의 솔직한 한마디
        </p>
      </div>

      {/* 결과 카드 or 로딩 */}
      {isLoading ? (
        <div className="flex flex-col items-center gap-4 mt-12">
          <div className="text-5xl" style={{ animation: 'game-float 1.5s ease-in-out infinite' }}>
            💭
          </div>
          <p className="text-sm" style={{ color: 'rgba(240,235,220,0.5)' }}>
            상대방의 반응을 분석 중이에요...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-4">
          {CHARACTERS.map((c, i) => {
            const result = results.find((r) => r.characterId === c.id);
            if (!result) return null;

            return (
              <div
                key={c.id}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,180,60,0.12)',
                  backdropFilter: 'blur(12px)',
                  animation: `game-card-in 0.5s ease ${i * 0.2}s both`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}
              >
                <PokemonSprite pokemonId={c.pokemonId} size={72} isActive={false} className="opacity-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold mb-1" style={{ color: '#f59e0b' }}>
                    {c.displayName}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#e0d8cc' }}>
                    "{result.reaction}"
                  </p>
                  <HeartGauge score={result.heartScore} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 다시 하기 */}
      {!isLoading && (
        <button
          onClick={onRestart}
          className="mt-8 w-full max-w-sm py-4 rounded-2xl text-base font-bold"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#e0d8cc',
            animation: 'game-fade-in-up 0.5s ease 0.7s both',
          }}
        >
          다시 하기 🔄
        </button>
      )}
    </div>
  );
}
