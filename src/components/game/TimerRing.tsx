import { useEffect, useRef, useState } from 'react';

interface TimerRingProps {
  totalSeconds: number;
  onExpire: () => void;
}

export function TimerRing({ totalSeconds, onExpire }: TimerRingProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;
    setRemaining(totalSeconds);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSeconds, onExpire]);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);
  const isWarning = remaining <= 30;

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  const ringColor = isWarning ? '#E84040' : '#F9A916';
  const bgColor = isWarning ? '#FFE0E0' : '#FFFEFA';
  const borderColor = isWarning ? '#C02020' : '#C48D3F';
  const shadowColor = isWarning ? '#A01010' : '#9B6A20';

  return (
    /* ACNH 스타일 박스 안에 타이머 링 */
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 80,
        height: 80,
        background: bgColor,
        border: `3px solid ${borderColor}`,
        borderRadius: 99,
        boxShadow: `0 4px 0 ${shadowColor}`,
        fontFamily: "'Nunito', sans-serif",
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <svg width={80} height={80} className="absolute inset-0 -rotate-90">
        {/* 배경 트랙 */}
        <circle
          cx={40}
          cy={40}
          r={radius}
          fill="none"
          stroke={`${borderColor}33`}
          strokeWidth={5}
        />
        {/* 진행 아크 */}
        <circle
          cx={40}
          cy={40}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>

      {/* 시간 텍스트 */}
      <span
        className="relative font-900 tabular-nums"
        style={{
          fontSize: 15,
          color: isWarning ? '#C02020' : '#3D2810',
          animation: isWarning ? 'pulse 0.8s ease-in-out infinite' : 'none',
        }}
      >
        {mm}:{ss}
      </span>
    </div>
  );
}
