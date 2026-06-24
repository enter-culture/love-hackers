import { useCallback, useEffect, useRef, useState } from 'react';

import { generateQuestionFn, generateReactionFn } from '@/lib/game.functions';
import type { Exchange, RotationCharacter } from '@/lib/game/types';

import { CafeBackground } from './CafeBackground';
import { DialoguePanel } from './DialoguePanel';
import { PokemonSprite } from './PokemonSprite';
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
        // 폴백 유지
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
    <div className="relative w-full h-screen overflow-hidden">
      <CafeBackground />

      {/* 만료 오버레이 */}
      {isExpired && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 30, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        >
          <div className="text-center game-entrance">
            <p className="text-5xl mb-3">🔔</p>
            <p className="text-lg font-bold" style={{ color: '#f5f0e8' }}>
              시간이 다 됐어요!
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(240,235,220,0.5)' }}>
              다음 상대로 넘어가요...
            </p>
          </div>
        </div>
      )}

      {/* 타이머 */}
      <div className="absolute top-14 right-4" style={{ zIndex: 20 }}>
        <TimerRing totalSeconds={180} onExpire={handleTimerExpire} />
      </div>

      {/* 캐릭터 이름 태그 */}
      <div className="absolute top-14 left-4" style={{ zIndex: 20 }}>
        <p
          className="text-xs font-semibold tracking-widest mb-0.5"
          style={{ color: '#f59e0b', opacity: 0.7 }}
        >
          지금 만나는 상대
        </p>
        <p className="text-xl font-bold" style={{ color: '#f5f0e8' }}>
          {character.displayName}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(240,235,220,0.4)' }}>
          {character.personality}
        </p>
      </div>

      {/* 포켓몬 스프라이트 */}
      <div
        className="absolute inset-0 flex items-center justify-center pb-64"
        style={{ zIndex: 10 }}
      >
        <PokemonSprite
          pokemonId={character.pokemonId}
          size={260}
          isActive={!isExpired}
          className="game-entrance"
        />
      </div>

      {/* 대화 패널 */}
      {!isExpired && currentQuestion && (
        <DialoguePanel
          character={character}
          question={currentQuestion.question}
          choices={currentQuestion.choices}
          onChoose={handleChoose}
          isLoading={isLoadingQuestion}
          chosenIndex={chosenIndex}
          reaction={reaction}
        />
      )}
    </div>
  );
}
