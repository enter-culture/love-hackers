import { CHARACTERS } from '@/lib/game/characters';

import { CafeBackground } from './CafeBackground';
import { PokemonSprite } from './PokemonSprite';

interface LobbyViewProps {
  onStart: () => void;
}

export function LobbyView({ onStart }: LobbyViewProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#080402' }}>
      <CafeBackground />

      <div
        className="absolute inset-0 flex flex-col items-center justify-between py-14 px-4"
        style={{ zIndex: 10 }}
      >
        {/* 타이틀 */}
        <div className="text-center game-entrance">
          <p
            className="text-xs tracking-widest mb-1 font-semibold"
            style={{ color: '#f59e0b', opacity: 0.7 }}
          >
            LOVE HACKERS
          </p>
          <h1 className="text-3xl font-bold" style={{ color: '#f5f0e8' }}>
            로테이션 소개팅
          </h1>
          <p className="text-sm mt-2" style={{ color: 'rgba(240,235,220,0.45)' }}>
            오늘의 소개팅 상대를 만나보세요 ✨
          </p>
        </div>

        {/* 캐릭터 3명 */}
        <div className="flex items-end justify-center gap-4 w-full max-w-xs">
          {CHARACTERS.map((c, i) => (
            <div key={c.id} className="flex flex-col items-center gap-2">
              <PokemonSprite
                pokemonId={c.pokemonId}
                size={i === 1 ? 130 : 100}
                className="game-entrance"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: '#f5f0e8' }}>
                  {c.displayName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,235,220,0.4)' }}>
                  {c.personality}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 rounded-2xl text-base font-bold"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.4)',
            border: 'none',
          }}
        >
          소개팅 시작하기 💫
        </button>
      </div>
    </div>
  );
}
