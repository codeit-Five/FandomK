import { useCallback, useEffect, useState } from 'react';
import arrowLeft from '@/assets/image/icons/ic_arrow_left.svg';
import arrowRight from '@/assets/image/icons/ic_arrow_right.svg';

export const DonateCarouselBtn = ({
  emblaApi,
  preloadDonation,
  isMobile,
  hasMore,
  isInitialLoadDone,
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

      // 데스크톱에서 Next로 이동 후, 다음 그룹을 미리 로드 (프리로딩)
      if (!isMobile && hasMore && isInitialLoadDone) {
        // 현재 커서 상태로 다음 페이지를 미리 로드
        preloadDonation();
      }
    }
  }, [emblaApi, isMobile, hasMore, isInitialLoadDone, preloadDonation]);

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
