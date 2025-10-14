import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DonateNavBtn, DonateCarouselBtn } from './DonateCarouselBtn';
import { NextBtnSkeleton } from '../skeleton/DonateSkeleton';

const DonateCarousel = props => {
  const {
    children,
    options,
    preloadDonation,
    isMobile,
    isLoading,
    hasMore,
    isInitialLoadDone,
  } = props;

  // Embla Carousel 설정
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { canScrollPrev, canScrollNext, onPrevBtnClick, onNextBtnClick } =
    DonateCarouselBtn({
      emblaApi,
      preloadDonation,
      isMobile,
      hasMore,
      isInitialLoadDone,
    });

  const getRenderedNextBtn = () => {
    // isMobile일 경우 아무것도 렌더링하지 않음
    if (isMobile) return null;

    // 초기 로딩 중 & 리스트가 비어있을 때 (스켈레톤 표시)
    if (isLoading && children.length === undefined) {
      return <NextBtnSkeleton />;
    }

    // 다음 버튼 표시 (스크롤 가능하거나 추가 데이터가 있을 때)
    if (canScrollNext || hasMore) {
      return (
        <DonateNavBtn
          variant="next"
          onClick={onNextBtnClick}
          disabled={isLoading}
        />
      );
    }

    // 3. 그 외의 경우 (마지막 페이지일 때, 아무것도 렌더링하지 않음)
    return null;
  };

  // 모바일 스크롤 감지 (스크롤 발생 시 주기적으로 추가 로드 시도)
  const loadDonationOnScroll = useCallback(() => {
    // 로딩 중이거나 더 이상 데이터가 없으면 리턴
    if (!hasMore || isLoading) return;
    if (!emblaApi) return;

    // 스크롤 이벤트 발생 시마다 로드 시도 (DonateSection에서 로딩 중 중복 호출 방지)
    preloadDonation();
  }, [hasMore, preloadDonation, isLoading, emblaApi]);

  // Embla 재초기화 (데이터 변경 시)
  useEffect(() => {
    // children 배열의 길이가 0보다 크면 reInit을 호출하여 캐러셀을 업데이트합니다.
    if (emblaApi && children.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, children, isMobile]);

  useEffect(() => {
    if (!isMobile || !emblaApi) return undefined;

    // 'scroll' 이벤트에 연결하여 스크롤 발생 시마다 로드 시도
    emblaApi.on('scroll', loadDonationOnScroll);

    return () => {
      emblaApi.off('scroll', loadDonationOnScroll);
    };
  }, [emblaApi, isMobile, loadDonationOnScroll]);

  return (
    <div className="donateBox">
      {/* 이전 버튼: 모바일이 아니고, 이전으로 스크롤 가능할 때 렌더링 */}
      {!isMobile && canScrollPrev && (
        <DonateNavBtn
          variant="prev"
          onClick={onPrevBtnClick}
          disabled={isLoading}
        />
      )}

      {/* 슬라이드 영역 */}
      <div className="donateListBox" ref={emblaRef}>
        <div className="donateList">{children}</div>
      </div>

      {/* 다음 버튼: 모바일이 아니고, 다음으로 스크롤 가능하거나 추가 데이터가 있을 때 렌더링 */}
      {getRenderedNextBtn()}
    </div>
  );
};

export default DonateCarousel;
