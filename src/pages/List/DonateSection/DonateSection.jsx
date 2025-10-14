import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { apiCall } from '@/apis/baseApi';
import { getDonations } from '@/apis/donationsApi';
import useWindowSize from '@/hooks/useWindowSize';
import Donate from '../Donate/Donate';
import DonateCarousel from './carousel/DonateCarousel';
import { DonateSkeletonList } from './skeleton/DonateSkeleton';
import './DonateSection.scss';

// 데스크톱/모바일 환경에 따른 데이터 요청 개수 정의
const DESKTOP_PAGE_SIZE = 4;
const MOBILE_PAGE_SIZE = 8;

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

  // Embla Carousel OPTIONS 생성 (useMemo를 사용하여 isMobile 값에 따라 옵션 정의)
  const OPTIONS = useMemo(
    () => ({
      duration: 50,
      dragFree: isMobile,
      watchDrag: isMobile, // 데스크톱에서는 드래그 비활성화
    }),
    [isMobile],
  );

  // 모바일/데스크톱 환경에 따라 데이터 요청 개수(size) 결정
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

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
        loadDonation={loadDonation}
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
