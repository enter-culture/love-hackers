import { useEffect, useState } from 'react';

import { generateResultFn } from '@/lib/game.functions';
import { CHARACTERS } from '@/lib/game/characters';
import type { CharacterResult, ConversationRecord } from '@/lib/game/types';

/* ── 캐릭터별 ACNH 사인 색상 ── */
const CHAR_COLOR: Record<string, { bg: string; border: string; text: string; emoji: string }> = {
  eevee:   { bg: '#C8A0E8', border: '#9060B8', text: '#fff',    emoji: '🌸' },
  pikachu: { bg: '#FFD740', border: '#C8A000', text: '#3D2810', emoji: '⚡' },
  lucario: { bg: '#6B9ECC', border: '#3A6898', text: '#fff',    emoji: '💎' },
};

/* ── 하트 게이지 ── */
interface HeartGaugeProps {
  score: number;
  color: string;
}

function HeartGauge({ score, color }: HeartGaugeProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 600);
    return () => clearTimeout(timer);
  }, [score]);

  const hearts = score >= 80 ? 5 : score >= 60 ? 4 : score >= 40 ? 3 : score >= 20 ? 2 : 1;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        {/* 하트 아이콘 */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="text-sm"
              style={{ opacity: i < hearts ? 1 : 0.2, transition: `opacity 0.4s ${i * 0.08}s ease` }}
            >
              ❤️
            </span>
          ))}
        </div>
        <span className="text-xs font-900" style={{ color, fontFamily: "'Nunito', sans-serif" }}>
          {score}%
        </span>
      </div>

      {/* 게이지 바 */}
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{
          background: 'rgba(196,141,63,0.15)',
          border: '1.5px solid rgba(196,141,63,0.25)',
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: `0 0 8px ${color}66`,
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

export function ResultView({
  conversations,
  cachedResults,
  onResultsReady,
  onRestart,
}: ResultViewProps) {
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

  /* 가장 높은 점수 캐릭터 */
  const bestMatch = results.length > 0
    ? results.reduce((a, b) => (a.heartScore >= b.heartScore ? a : b))
    : null;

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── 배경: ACNH 하늘 + 잔디 ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--ac-sky-top) 0%, var(--ac-sky-bot) 50%, #B8DFC8 100%)',
        }}
      />

      {/* 잔디 */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '35%',
          background: 'linear-gradient(to bottom, var(--ac-grass-top), var(--ac-grass-bot))',
          borderRadius: '60% 60% 0 0 / 50% 50% 0 0',
          marginLeft: '-5%',
          marginRight: '-5%',
        }}
      />

      {/* 구름 */}
      {[
        { x: 5,  y: 6,  s: 0.9, d: 0 },
        { x: 60, y: 4,  s: 0.7, d: 3 },
        { x: 78, y: 12, s: 0.8, d: 5 },
      ].map(({ x, y, s, d }) => (
        <div
          key={x}
          className="absolute pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `scale(${s})`,
            transformOrigin: 'left center',
            animation: `ac-cloud-drift ${10 + d}s ease-in-out ${d}s infinite alternate`,
            opacity: 0.85,
          }}
        >
          <div className="relative" style={{ width: 80, height: 44 }}>
            <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 99, bottom: 8 }} />
            <div style={{ position: 'absolute', width: 44, height: 44, background: '#fff', borderRadius: 99, top: -14, left: 8 }} />
            <div style={{ position: 'absolute', width: 36, height: 36, background: '#fff', borderRadius: 99, top: -11, left: 36 }} />
          </div>
        </div>
      ))}

      {/* ── 콘텐츠 ── */}
      <div className="relative z-10 flex flex-col items-center px-4 py-12 min-h-screen">

        {/* 헤더 */}
        <div className="text-center mb-6 game-entrance">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{
              background: 'var(--ac-cream)',
              border: '2.5px solid var(--ac-border)',
              boxShadow: '0 3px 0 var(--ac-border-dark)',
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--ac-text)',
            }}
          >
            <span>💌</span>
            <span>오늘의 소개팅 결과</span>
          </div>

          <h2
            className="font-900 leading-tight"
            style={{ fontSize: 26, color: '#3D2810', textShadow: '0 2px 0 rgba(255,255,255,0.6)' }}
          >
            상대방의 한마디
          </h2>

          {!isLoading && bestMatch && (() => {
            const best = CHARACTERS.find((c) => c.id === bestMatch.characterId);
            return best ? (
              <p className="mt-2 font-700" style={{ fontSize: 13, color: '#5A3E22' }}>
                💘 오늘의 최고 궁합: {best.displayName} ({bestMatch.heartScore}%)
              </p>
            ) : null;
          })()}
        </div>

        {/* 결과 카드 or 로딩 */}
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 mt-8">
            <div
              className="p-6 rounded-3xl text-center"
              style={{
                background: 'var(--ac-cream)',
                border: '4px solid var(--ac-border)',
                boxShadow: '0 6px 0 var(--ac-border-dark)',
              }}
            >
              <div className="text-5xl mb-3" style={{ animation: 'game-float 1.5s ease-in-out infinite' }}>
                💭
              </div>
              <p className="font-800 text-sm" style={{ color: 'var(--ac-text)' }}>
                상대방의 반응 분석 중...
              </p>
              <div className="flex justify-center gap-1.5 mt-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: 'var(--ac-orange)',
                      animation: `ac-dot-bounce 0.9s ease-in-out ${i * 0.18}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-4">
            {CHARACTERS.map((c, i) => {
              const result = results.find((r) => r.characterId === c.id);
              if (!result) return null;

              const color = CHAR_COLOR[c.id] ?? { bg: '#F9A916', border: '#C47000', text: '#fff', emoji: '✨' };
              const isBest = bestMatch?.characterId === c.id;

              const gaugeColor =
                result.heartScore >= 80 ? '#E84393'
                : result.heartScore >= 60 ? '#F9A916'
                : result.heartScore >= 40 ? '#3CB87A'
                : '#92B8E2';

              return (
                <div
                  key={c.id}
                  className="relative"
                  style={{
                    animation: `ac-slide-up 0.5s ease ${i * 0.15}s both`,
                  }}
                >
                  {/* 최고 궁합 배지 */}
                  {isBest && (
                    <div
                      className="absolute -top-3 right-4 px-3 py-0.5 rounded-full z-10"
                      style={{
                        background: 'linear-gradient(to right, #FFD740, #F9A916)',
                        border: '2px solid #C8A000',
                        fontSize: 11,
                        fontWeight: 900,
                        color: '#3D2810',
                        boxShadow: '0 2px 0 #9B6A00',
                      }}
                    >
                      ⭐ 베스트 매치
                    </div>
                  )}

                  {/* 카드 본체 */}
                  <div
                    className="px-4 py-4"
                    style={{
                      background: 'var(--ac-cream)',
                      border: `3px solid ${isBest ? color.border : 'var(--ac-border)'}`,
                      borderRadius: 20,
                      boxShadow: `0 5px 0 ${isBest ? color.border : 'var(--ac-border-dark)'}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* 포켓몬 원형 프레임 */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="rounded-full overflow-hidden flex items-center justify-center"
                          style={{
                            width: 72,
                            height: 72,
                            background: `linear-gradient(135deg, ${color.bg}55, ${color.bg}22)`,
                            border: `3px solid ${color.border}`,
                            boxShadow: `0 3px 0 ${color.border}88`,
                          }}
                        >
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${c.pokemonId}.png`}
                            alt={c.displayName}
                            style={{ width: 62, height: 62, objectFit: 'contain' }}
                          />
                        </div>

                        {/* 이름 태그 */}
                        <div
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full"
                          style={{
                            background: color.bg,
                            border: `2px solid ${color.border}`,
                            fontSize: 10,
                            fontWeight: 900,
                            color: color.text,
                            boxShadow: `0 2px 0 ${color.border}88`,
                          }}
                        >
                          {color.emoji} {c.displayName}
                        </div>
                      </div>

                      {/* 반응 & 게이지 */}
                      <div className="flex-1 min-w-0 pt-1">
                        {/* 말풍선 같은 반응 텍스트 */}
                        <div
                          className="px-3 py-2 rounded-xl text-sm font-700 leading-relaxed"
                          style={{
                            background: `${color.bg}22`,
                            border: `1.5px solid ${color.bg}66`,
                            color: 'var(--ac-text)',
                          }}
                        >
                          "{result.reaction}"
                        </div>

                        <HeartGauge score={result.heartScore} color={gaugeColor} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 다시 하기 버튼 */}
        {!isLoading && (
          <div
            className="mt-8 w-full max-w-sm"
            style={{ animation: 'ac-slide-up 0.5s ease 0.6s both' }}
          >
            <button className="ac-primary-btn w-full" onClick={onRestart}>
              <span>🔄</span>
              <span>다시 해볼까요?</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
