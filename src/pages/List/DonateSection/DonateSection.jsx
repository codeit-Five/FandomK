import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { apiCall } from '@/apis/baseApi';
import { getDonations } from '@/apis/donationsApi';
import useWindowSize from '@/hooks/useWindowSize';
import Donate from '../Donate/Donate';
import DonateCarousel from './carousel/DonateCarousel';
import { DonateSkeletonList } from './skeleton/DonateSkeleton';
import './DonateSection.scss';

// 데스크톱 환경에서 표시되는 데이터 개수
const DESKTOP_GROUP_SIZE = 4;
// 모바일 스크롤 시 주기적으로 로드할 개수
const MOBILE_PRELOAD_SIZE = 3;

// 초기 로딩 시 데스크톱/모바일 동일하게 8개 로드
const INITIAL_LOAD_SIZE = 8;

const DonateSection = () => {
  const didMountRef = useRef(false);
  const isLoadingRef = useRef(false); // isLoading을 ref로 관리
  const [donateList, setDonateList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false); // 초기 로딩 완료 상태

  const { width } = useWindowSize();

  // 반응형: 1200px 미만에서는 모바일로 간주
  const isMobile = width < 1200;

  // Embla Carousel OPTIONS 생성 (useMemo를 사용하여 isMobile 값에 따라 옵션 정의)
  const OPTIONS = useMemo(
    () => ({
      duration: 30,
      dragFree: isMobile,
      watchDrag: isMobile, // 데스크톱에서는 드래그 비활성화
    }),
    [isMobile],
  );

  // 데스크톱용 페이지 그룹 생성 (4개씩 묶기)
  const getPageGroups = useCallback(() => {
    if (isMobile) {
      return donateList.map(item => [item]);
    }

    const groups = [];
    for (let i = 0; i < donateList.length; i += DESKTOP_GROUP_SIZE) {
      const items = donateList.slice(i, i + DESKTOP_GROUP_SIZE);
      groups.push({ items, groupKey: items.map(item => item.id).join('') });
    }
    return groups;
  }, [donateList, isMobile]);

  // 다음 페이지를 미리 로드
  const preloadDonation = useCallback(async () => {
    // 로딩 중이거나 더 이상 데이터가 없으면 즉시 종료
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;

    const size = isMobile ? MOBILE_PRELOAD_SIZE : DESKTOP_GROUP_SIZE;
    const result = await apiCall(getDonations, size, cursor, null);

    if (!result) {
      isLoadingRef.current = false;
      return;
    }

    setDonateList(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueNewItems = result.list.filter(
        item => !existingIds.has(item.id),
      );
      return [...prev, ...uniqueNewItems];
    });

    setCursor(result.nextCursor);
    setHasMore(result.nextCursor !== null);

    isLoadingRef.current = false;
  }, [cursor, isMobile, hasMore]);

  // 후원 후 데이터 새로고침
  const refreshDonations = async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    // 처음부터 다시 로드 (cursor: null)
    const size = isMobile ? INITIAL_LOAD_SIZE : DESKTOP_GROUP_SIZE;
    const result = await apiCall(getDonations, size, null, null);

    if (!result) return;

    setDonateList(result.list);
    setCursor(result.nextCursor);
    setHasMore(result.nextCursor !== null);

    isLoadingRef.current = false;
    setIsLoading(false);
  };

  // 초기 로드 및 화면 크기 변경 시 처리
  useEffect(() => {
    // 개발 환경에서 Strict Mode로 인한 이중 호출 방지 로직
    if (process.env.NODE_ENV === 'development' && !didMountRef.current) {
      didMountRef.current = true;
      return undefined;
    }

    if (width !== 0) {
      // 화면 크기 변경 시 데이터 리셋하고 다시 로드
      const resetAndLoad = async () => {
        // 상태 초기화
        setDonateList([]);
        setCursor(null);
        setHasMore(true);

        // 초기 로딩 시작
        setIsInitialLoadDone(false);

        // 로딩 상태 시작
        isLoadingRef.current = true;
        setIsLoading(true);

        // API 호출: 현재 결정된 pageSize를 사용하여 첫 페이지 데이터 요청 (cursor: null)
        const result = await apiCall(
          getDonations,
          INITIAL_LOAD_SIZE, // 초기 로딩 시: 데스크톱/모바일 구분 없이 8개 요청
          null,
          null,
        );

        if (result) {
          // API 결과로 리스트 업데이트
          setDonateList(result.list);
          // 다음 페이지를 위한 커서 업데이트
          setCursor(result.nextCursor);
          // nextCursor가 null이 아니면 hasMore를 true로 설정
          setHasMore(result.nextCursor !== null);
          // 초기 로딩 완료
          setIsInitialLoadDone(true);
        }

        // 로딩 상태 종료
        isLoadingRef.current = false;
        setIsLoading(false);
      };

      // 디바운스 로직: 300ms 동안 width 변화가 멈춘 후에만 resetAndLoad 실행
      const handler = setTimeout(() => {
        resetAndLoad();
      }, 300);

      // cleanup 함수: 다음 width 변경 시 이전 타이머를 취소함
      return () => {
        clearTimeout(handler);
      };
    }

    return undefined;
  }, [width, isMobile]);

  const getRenderedList = () => {
    // 초기 로딩 중 & 리스트가 비어있을 때 (스켈레톤 표시)
    if (isLoading && donateList.length === 0) {
      return <DonateSkeletonList width={width} isMobile={isMobile} />;
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

  return (
    <section className="donateSection">
      <h2 className="donateSectionTitle">후원을 기다리는 조공</h2>
      {/* DonateCarousel 컴포넌트 사용 */}
      <DonateCarousel
        options={OPTIONS}
        preloadDonation={preloadDonation}
        isInitialLoadDone={isInitialLoadDone}
        isMobile={isMobile}
        hasMore={hasMore}
        isLoading={isLoading} // 로딩 상태 전달
      >
        {/* 슬라이드 내용 전달 */}
        {getRenderedList()}
      </DonateCarousel>
    </section>
  );
};

export default DonateSection;
