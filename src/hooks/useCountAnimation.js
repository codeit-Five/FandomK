import { useEffect, useState, useRef } from 'react';

/**
 * 숫자가 0 (또는 이전 값)에서 최종 값까지 부드럽게 증가하는 애니메이션 훅
 *
 * @param {number} endValue - 목표 숫자.
 * @param {number} [duration=1000] - 애니메이션 지속 시간 (ms).
 * @returns {number} 현재 카운트 값.
 */
const useCountAnimation = (endValue, duration = 1000) => {
  const [count, setCount] = useState(0);
  // 이전 최종 값을 저장하여 다음 애니메이션 시작점으로 사용
  const prevValueRef = useRef(null);

  useEffect(() => {
    const isFirstRender = prevValueRef.current === null;
    const prevValue = prevValueRef.current ?? 0;

    // 값이 감소하면 0부터, 증가하면 이전 값부터 시작
    const startValue = isFirstRender || endValue < prevValue ? 0 : prevValue;
    const difference = endValue - startValue;

    let startTime;
    let animationFrame;

    const animate = currentTime => {
      if (!startTime) startTime = currentTime;
      // 진행률 (0.0 ~ 1.0)
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOutQuad 이징 효과 적용
      const easeProgress = 1 - (1 - progress) ** 2;

      // 현재 카운트 값을 계산하여 업데이트
      setCount(Math.floor(startValue + difference * easeProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // 완료 시 최종 값으로 설정하고 Ref에 저장
        setCount(endValue);
        prevValueRef.current = endValue;
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // 클린업: 애니메이션 중지
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration]);

  return count;
};

export default useCountAnimation;
