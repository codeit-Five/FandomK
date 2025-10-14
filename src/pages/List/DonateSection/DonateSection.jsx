import { useState, useEffect, useRef, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Donate from '../Donate/Donate';
import { apiCall } from '@/apis/baseApi';
import { getDonations } from '@/apis/donationsApi';
import useWindowSize from '@/hooks/useWindowSize';
import './DonateSection.scss';
import arrowLeft from '@/assets/image/icons/ic_arrow_left.svg';
import arrowRight from '@/assets/image/icons/ic_arrow_right.svg';

// 데스크톱/모바일 환경에 따른 데이터 요청 개수 정의
const DESKTOP_PAGE_SIZE = 4;
const MOBILE_PAGE_SIZE = 8;

// 데스크톱/모바일 환경에 따른 Donate 컴포넌트의 너비 정의
const DESKTOP_DONATE_SIZE = 282;
const MOBILE_DONATE_SIZE = 158;

// 스켈레톤 색상 정의
const BASE_COLOR = '#333';
const HIGHLIGHT_COLOR = '#444';

// Donate 컴포넌트의 형태를 모방한 스켈레톤 컴포넌트 정의
const SkeletonItem = ({ isMobile }) => {
  // 모바일/데스크톱 크기 반영
  const fullHeight = isMobile ? '303px' : '402px';
  const imageHeight = isMobile ? 206 : 293;

  return (
    <div
      className="donateItem skeleton"
      style={{
        width: '100%',
        display: 'block',
        position: 'relative',
        height: fullHeight,
      }}
    >
      {/* 1. 이미지 영역: isMobile에 따라 높이 변경 */}
      <Skeleton
        height={imageHeight}
        borderRadius={8}
        style={{ marginBottom: '12px' }}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />

      {/* 2. 제목/부제목 영역 (텍스트 라인) */}
      <Skeleton
        width="50%"
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
        style={{ marginBottom: '8px' }}
      />
      <Skeleton
        width="60%"
        style={{ marginBottom: '24px' }}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />

      {/* 3. 크레딧/남은 일수 영역 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 크레딧 영역 (좌측) */}
        <Skeleton
          width="50px"
          height={12}
          baseColor={BASE_COLOR}
          highlightColor={HIGHLIGHT_COLOR}
        />

        {/* 남은 일수 영역 (우측) */}
        <Skeleton
          width="45px"
          height={12}
          baseColor={BASE_COLOR}
          highlightColor={HIGHLIGHT_COLOR}
        />
      </div>
    </div>
  );
};

const DonateSection = () => {
  const didMountRef = useRef(false);
  const isLoadingRef = useRef(false); // isLoading을 ref로 관리
  const [donateList, setDonateList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();

  // 반응형: 1200px 미만에서는 모바일로 간주
  const isMobile = width < 1200;

  // 표시할 스켈레톤 컴포넌트의 갯수 확인
  const getSkeletonSize = () => {
    if (width < 525) return Math.round(width / MOBILE_DONATE_SIZE);
    if (width < 1200) return Math.round(width / DESKTOP_DONATE_SIZE);
    return DESKTOP_PAGE_SIZE;
  };

  // 모바일/데스크톱 환경에 따라 데이터 요청 개수(size) 결정
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  // Embla Carousel 설정
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: isMobile,
    loop: false,
    skipSnaps: false,
    watchDrag: isMobile, // 데스크톱에서는 드래그 비활성화
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // 데스크톱용 페이지 그룹 생성 (4개씩 묶기)
  const getPageGroups = useCallback(() => {
    if (isMobile) {
      return donateList.map(item => [item]);
    }

    const groups = [];
    for (let i = 0; i < donateList.length; i += DESKTOP_PAGE_SIZE) {
      const items = donateList.slice(i, i + DESKTOP_PAGE_SIZE);
      groups.push({ items, groupKey: items.map(item => item.id).join('') });
    }
    return groups;
  }, [donateList, isMobile]);

  // Embla의 스크롤 버튼 상태 업데이트
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('init', onSelect); // init 이벤트 추가

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('init', onSelect);
    };
  }, [emblaApi, onSelect]);

  const loadDonation = useCallback(async () => {
    // 현재 로딩 중이거나, 모바일 환경에서 더 이상 데이터가 없다면 즉시 종료
    // ref를 사용해서 중복 호출 방지
    if (isLoadingRef.current || (isMobile && !hasMore)) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    const result = await apiCall(getDonations, pageSize, cursor, null);

    if (!result) return;

    // 키 중복 해결 로직: 새로운 데이터를 추가하기 전에 중복 ID를 가진 항목을 제거
    setDonateList(prev => {
      // 기존 리스트 항목의 ID만 모은 Set 생성
      const existingIds = new Set(prev.map(item => item.id));

      // 새로운 리스트에서 기존 리스트에 없는 항목만 필터링
      const uniqueNewItems = result.list.filter(
        item => !existingIds.has(item.id),
      );

      // 중복이 제거된 새로운 항목을 기존 리스트 뒤에 추가
      return [...prev, ...uniqueNewItems];
    });

    setCursor(result.nextCursor);
    setHasMore(result.nextCursor !== null);

    isLoadingRef.current = false;
    setIsLoading(false);
  }, [cursor, isMobile, hasMore, pageSize]);

  // 후원 후 데이터 새로고침
  const refreshDonations = async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    // 처음부터 다시 로드 (cursor: null)
    const result = await apiCall(getDonations, pageSize, null, null);
    if (result) {
      setDonateList(result.list);
      setCursor(result.nextCursor);
      setHasMore(result.nextCursor !== null);

      // Embla를 첫 슬라이드로 이동
      if (emblaApi) {
        emblaApi.scrollTo(0);
      }
    }

    isLoadingRef.current = false;
    setIsLoading(false);
  };

  // 다음 슬라이드로 이동
  const scrollNext = useCallback(async () => {
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

  // 이전 슬라이드로 이동
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  // 초기 로드 및 화면 크기 변경 시 처리
  useEffect(() => {
    // 개발 환경에서 Strict Mode로 인한 이중 호출 방지 로직
    if (process.env.NODE_ENV === 'development' && !didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (width !== 0) {
      // 화면 크기 변경 시 데이터 리셋하고 다시 로드
      const resetAndLoad = async () => {
        // 상태 초기화
        setDonateList([]);
        setCursor(null);
        setHasMore(true);

        // 로딩 상태 시작
        isLoadingRef.current = true;
        setIsLoading(true);

        // API 호출: 현재 결정된 pageSize를 사용하여 첫 페이지 데이터 요청 (cursor: null)
        const result = await apiCall(getDonations, pageSize, null, null);
        if (result) {
          // API 결과로 리스트 업데이트
          setDonateList(result.list);
          // 다음 페이지를 위한 커서 업데이트
          setCursor(result.nextCursor);
          // nextCursor가 null이 아니면 hasMore를 true로 설정
          setHasMore(result.nextCursor !== null);
        }

        // 로딩 상태 종료
        isLoadingRef.current = false;
        setIsLoading(false);
      };

      resetAndLoad();
    }
  }, [width, pageSize]);

  // 모바일 스크롤 감지 (무한 스크롤)
  useEffect(() => {
    if (!isMobile || !emblaApi) return undefined;

    const handleScroll = () => {
      if (!hasMore || isLoadingRef.current) return;

      const scrollProgress = emblaApi.scrollProgress();

      // 스크롤 진행도가 80%를 넘으면 추가 로드
      if (scrollProgress > 0.8) {
        loadDonation();
      }
    };

    emblaApi.on('scroll', handleScroll);

    return () => {
      emblaApi.off('scroll', handleScroll);
    };
  }, [emblaApi, isMobile, hasMore, loadDonation]);

  // Embla 재초기화 (데이터 변경 시)
  useEffect(() => {
    if (emblaApi && donateList.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, donateList, isMobile]);

  const getRenderedList = () => {
    // 초기 로딩 중 & 리스트가 비어있을 때 (스켈레톤 표시)
    if (isLoading && donateList.length === 0) {
      const skeletonItems = Array(getSkeletonSize())
        .fill(0)
        .map((_, index) => (
          <div className="donateContainer" key={`skeleton${index}`}>
            <SkeletonItem isMobile={isMobile} />
          </div>
        ));

      // 데스크톱: 그룹으로 감싸기, 모바일: 그대로 반환
      return isMobile ? (
        skeletonItems
      ) : (
        <div className="donateGroup" key="skeletonGroup">
          {skeletonItems}
        </div>
      );
    }

    // 모바일: 개별 아이템
    if (isMobile) {
      return donateList.map(donation => (
        <div className="donateSilde" key={donation.id}>
          <Donate donation={donation} onDonateSuccess={refreshDonations} />
        </div>
      ));
    }

    // 데스크톱: 4개씩 그룹으로
    const pageGroups = getPageGroups();
    return pageGroups.map(group => (
      <div className="donateGroup" key={group.groupKey}>
        {group.items.map(donation => (
          <div className="donateSilde" key={donation.id}>
            <Donate donation={donation} onDonateSuccess={refreshDonations} />
          </div>
        ))}
      </div>
    ));
  };

  const getRenderedNextBtn = () => {
    // isMobile일 경우 아무것도 렌더링하지 않음
    if (isMobile) return null;

    // 초기 로딩 중 & 리스트가 비어있을 때 (스켈레톤 표시)
    if (isLoading && donateList.length === 0) {
      return (
        <div className="donateNavBtn skeleton-btn">
          <Skeleton
            width={40}
            height={78.333}
            borderRadius={6.667}
            baseColor={BASE_COLOR}
            highlightColor={HIGHLIGHT_COLOR}
          />
        </div>
      );
    }

    // 다음 버튼 표시 (스크롤 가능하거나 추가 데이터가 있을 때)
    if (canScrollNext || hasMore) {
      return (
        <button
          className="donateNavBtn"
          onClick={scrollNext}
          disabled={isLoading}
        >
          <img src={arrowRight} alt="다음" />
        </button>
      );
    }

    // 3. 그 외의 경우 (마지막 페이지일 때, 아무것도 렌더링하지 않음)
    return null;
  };

  return (
    <section className="donateSection">
      <h2 className="donateSectionTitle">후원을 기다리는 조공</h2>
      <div className="donateBox">
        {!isMobile && canScrollPrev && (
          <button
            className="donateNavBtn"
            onClick={scrollPrev}
            disabled={isLoading}
          >
            <img src={arrowLeft} alt="이전" />
          </button>
        )}

        <div className="donateListBox" ref={emblaRef}>
          <div className="donateList">{getRenderedList()}</div>
        </div>

        {getRenderedNextBtn()}
      </div>
    </section>
  );
};

export default DonateSection;
