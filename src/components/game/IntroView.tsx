import { useEffect, useState } from 'react';

import Lottie from 'lottie-react';

/* 구글 로고 SVG */
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* Lottie 데이터 (떠다니는 하트) — 공개 URL에서 로드 */
const LOTTIE_URL =
  'https://assets2.lottiefiles.com/packages/lf20_ycpnLq.json';

interface IntroViewProps {
  onLogin: () => void;
}

export function IntroView({ onLogin }: IntroViewProps) {
  const [animData, setAnimData] = useState<object | null>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  /* Lottie JSON 로드 */
  useEffect(() => {
    fetch(LOTTIE_URL)
      .then((r) => r.json())
      .then(setAnimData)
      .catch(() => setAnimData(null));
  }, []);

  /* 순서대로 등장 */
  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 400);
    const t2 = setTimeout(() => setSubtitleVisible(true), 1000);
    const t3 = setTimeout(() => setBtnVisible(true), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggingIn(true);
    /* 데모: 0.8초 후 로비로 이동 */
    setTimeout(onLogin, 800);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-between"
      style={{
        background: 'linear-gradient(160deg, #0A0005 0%, #1A0010 40%, #0D0008 100%)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── 배경 빛망울 ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(200,0,60,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,30,80,0.08) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── 상단 배지 ── */}
      <div className="pt-14 flex flex-col items-center">
        <div
          className="px-4 py-1 rounded-full mb-1"
          style={{
            border: '1px solid rgba(255,80,100,0.35)',
            background: 'rgba(255,30,60,0.1)',
            fontSize: 11,
            fontWeight: 800,
            color: 'rgba(255,160,160,0.8)',
            letterSpacing: '0.12em',
          }}
        >
          LOVE HACKERS × 로테이션 소개팅
        </div>
      </div>

      {/* ── 중앙 콘텐츠 ── */}
      <div className="flex flex-col items-center flex-1 justify-center w-full px-6">
        {/* Lottie 하트 애니메이션 */}
        <div style={{ width: 220, height: 220, marginBottom: -20 }}>
          {animData ? (
            <Lottie animationData={animData} loop autoplay />
          ) : (
            /* 로드 전 placeholder */
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: 80 }}>❤️</span>
            </div>
          )}
        </div>

        {/* 메인 타이틀 — 나는솔로 스타일 */}
        <div
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            textAlign: 'center',
          }}
        >
          {/* 작은 수식어 */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'rgba(255,120,140,0.75)',
              marginBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            AI 포켓몬과 함께하는
          </p>

          {/* 메인 타이틀 */}
          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#FFFFFF',
              textShadow:
                '0 0 40px rgba(255,60,100,0.6), 0 2px 8px rgba(0,0,0,0.8)',
              letterSpacing: '-0.01em',
            }}
          >
            나는
            <span
              style={{
                color: '#FF3C64',
                textShadow:
                  '0 0 30px rgba(255,60,100,0.9), 0 0 60px rgba(255,60,100,0.4)',
              }}
            >
              {' '}솔로
            </span>
          </h1>

          {/* 부제목 */}
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 8,
              letterSpacing: '0.05em',
            }}
          >
            로테이션 소개팅 에디션
          </p>
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: 48,
            height: 2,
            background: 'linear-gradient(to right, transparent, #FF3C64, transparent)',
            margin: '24px 0',
            opacity: subtitleVisible ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* 설명 */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 260,
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          3분 타이머 · 3개 선택지 · 3명의 상대
          <br />
          오늘 당신의 인연은?
        </p>
      </div>

      {/* ── 하단 구글 로그인 버튼 ── */}
      <div
        className="w-full px-6 pb-14"
        style={{
          opacity: btnVisible ? 1 : 0,
          transform: btnVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3"
          style={{
            height: 54,
            borderRadius: 14,
            background: isLoggingIn ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            border: 'none',
            cursor: isLoggingIn ? 'default' : 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: isLoggingIn ? 'rgba(255,255,255,0.5)' : '#1A1A1A',
            boxShadow: isLoggingIn ? 'none' : '0 4px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.25s ease',
          }}
        >
          {isLoggingIn ? (
            <>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: '2.5px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'rgba(255,255,255,0.8)',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}
              />
              <span>로그인 중...</span>
            </>
          ) : (
            <>
              <GoogleLogo />
              <span>Google로 로그인하기</span>
            </>
          )}
        </button>

        {/* 하단 안내 */}
        <p
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.2)',
            textAlign: 'center',
            marginTop: 12,
            fontWeight: 600,
          }}
        >
          로그인하면 이용약관 및 개인정보 처리방침에 동의합니다
        </p>
      </div>
    </div>
  );
}
