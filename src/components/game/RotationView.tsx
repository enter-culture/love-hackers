import { useCallback, useEffect, useRef, useState } from 'react';

import { generateQuestionFn, generateReactionFn } from '@/lib/game.functions';
import type { Exchange, RotationCharacter } from '@/lib/game/types';

import { CafeBackground } from './CafeBackground';
import { DialoguePanel } from './DialoguePanel';
import { TimerRing } from './TimerRing';

interface QuestionState {
  question: string;
  choices: [string, string, string];
}

interface RotationViewProps {
  character: RotationCharacter;
  onComplete: (exchanges: Exchange[]) => void;
}

export function RotationView({ character, onComplete }: RotationViewProps) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const exchangesRef = useRef<Exchange[]>([]);
  exchangesRef.current = exchanges;

  const loadNextQuestion = useCallback(
    async (history: { question: string; chosen: string }[]) => {
      setIsLoadingQuestion(true);
      setChosenIndex(null);
      setReaction(null);

      try {
        const result = await generateQuestionFn({ data: { character, history } });
        setCurrentQuestion(result as QuestionState);
      } catch {
        setCurrentQuestion({ question: '오늘 기분이 어때?', choices: ['좋아!', '보통이야', '피곤해'] });
      } finally {
        setIsLoadingQuestion(false);
      }
    },
    [character],
  );

  useEffect(() => {
    setExchanges([]);
    setIsExpired(false);
    setCurrentQuestion(null);
    setChosenIndex(null);
    setReaction(null);
    loadNextQuestion([]);
  }, [character.id, loadNextQuestion]);

  const handleChoose = useCallback(
    async (index: number, chosenText: string) => {
      if (!currentQuestion || chosenIndex !== null) return;

      setChosenIndex(index);
      setIsLoadingQuestion(true);

      let reactionText = '흥미롭네...';
      try {
        const res = await generateReactionFn({
          data: {
            character,
            chosenText,
            history: exchangesRef.current.map((e) => ({
              question: e.question,
              chosen: e.choices[e.chosenIndex],
            })),
          },
        });
        reactionText = res.reaction;
      } catch {
        // 폴백
      }

      const newExchange: Exchange = {
        question: currentQuestion.question,
        choices: currentQuestion.choices,
        chosenIndex: index,
        reaction: reactionText,
      };

      setReaction(reactionText);
      setIsLoadingQuestion(false);

      const updatedExchanges = [...exchangesRef.current, newExchange];
      setExchanges(updatedExchanges);

      if (!isExpired) {
        setTimeout(() => {
          loadNextQuestion(
            updatedExchanges.map((e) => ({ question: e.question, chosen: e.choices[e.chosenIndex] })),
          );
        }, 2200);
      }
    },
    [currentQuestion, chosenIndex, character, isExpired, loadNextQuestion],
  );

  const handleTimerExpire = useCallback(() => {
    setIsExpired(true);
    setTimeout(() => onComplete(exchangesRef.current), 1800);
  }, [onComplete]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── 3D 카페 씬 (포켓몬 빌보드 포함) ── */}
      <CafeBackground pokemonId={character.pokemonId} />

      {/* ── UI 오버레이 ── */}
      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, pointerEvents: 'none' }}>

        {/* 상단 바 */}
        <div className="flex items-start justify-between px-4 pt-12 pb-0" style={{ pointerEvents: 'auto' }}>
          {/* 캐릭터 정보 배지 */}
          <div
            className="px-3 py-2 rounded-2xl"
            style={{
              background: 'rgba(255,254,250,0.88)',
              border: '2.5px solid var(--ac-border)',
              boxShadow: '0 3px 0 var(--ac-border-dark)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="font-900 text-base leading-tight" style={{ color: 'var(--ac-text)' }}>
              {character.displayName}
            </p>
            <p className="font-600 text-xs leading-tight mt-0.5" style={{ color: '#8B6030' }}>
              {character.personality}
            </p>
          </div>

          <TimerRing totalSeconds={180} onExpire={handleTimerExpire} />
        </div>

        {/* 빈 공간 (3D 캐릭터 영역) */}
        <div className="flex-1" />

        {/* 대화 패널 */}
        {!isExpired && currentQuestion && (
          <div style={{ pointerEvents: 'auto' }}>
            <DialoguePanel
              character={character}
              question={currentQuestion.question}
              choices={currentQuestion.choices}
              onChoose={handleChoose}
              isLoading={isLoadingQuestion}
              chosenIndex={chosenIndex}
              reaction={reaction}
            />
          </div>
        )}
      </div>

      {/* ── 시간 종료 오버레이 ── */}
      {isExpired && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 30, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div className="game-entrance text-center">
            <div
              className="px-8 py-6 rounded-3xl"
              style={{
                background: 'var(--ac-cream)',
                border: '4px solid var(--ac-border)',
                boxShadow: '0 8px 0 var(--ac-border-dark)',
              }}
            >
              <p className="text-4xl mb-3">🔔</p>
              <p className="text-lg font-900" style={{ color: 'var(--ac-text)' }}>
                시간이 다 됐어요!
              </p>
              <p className="text-sm font-600 mt-1" style={{ color: '#8B6030' }}>
                다음 상대로 넘어가요...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
