import { useCallback, useEffect, useState } from 'react';
import arrowLeft from '@/assets/image/icons/ic_arrow_left.svg';
import arrowRight from '@/assets/image/icons/ic_arrow_right.svg';

export const DonateCarouselBtn = ({
  emblaApi,
  loadDonation,
  isMobile,
  hasMore,
}) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onPrevBtnClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextBtnClick = useCallback(async () => {
    if (!emblaApi) return;

    const canScroll = emblaApi.canScrollNext();

    // 스크롤 가능하면 이동
    if (canScroll) {
      emblaApi.scrollNext();
    }
    // 데스크톱에서 더 이상 스크롤할 수 없지만 추가 데이터가 있으면 로드
    else if (!isMobile && hasMore) {
      await loadDonation();
      // 데이터 로드 후 다음 슬라이드로 이동
      setTimeout(() => {
        if (emblaApi) {
          emblaApi.scrollNext();
        }
      }, 100);
    }
  }, [emblaApi, isMobile, hasMore, loadDonation]);

  const onSelect = useCallback(emblaApi => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    canScrollPrev,
    canScrollNext,
    onPrevBtnClick,
    onNextBtnClick,
  };
};

export const DonateNavBtn = ({ variant, onClick, disabled }) => {
  return (
    <button className="donateNavBtn" onClick={onClick} disabled={disabled}>
      {variant === 'next' && <img src={arrowRight} alt="다음" />}
      {variant === 'prev' && <img src={arrowLeft} alt="이전" />}
    </button>
  );
};
