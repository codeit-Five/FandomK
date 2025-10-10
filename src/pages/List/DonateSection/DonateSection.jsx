import { useState, useEffect, useRef, useCallback } from 'react';
import Donate from '../Donate/Donate';
import { apiCall } from '../../../apis/baseApi';
import { getDonations } from '../../../apis/donationsApi';
import useWindowSize from '../../../hooks/useWindowSize';
import './DonateSection.scss';
import arrowLeft from '../../../assets/image/icons/ic_arrow_left.svg';
import arrowRight from '../../../assets/image/icons/ic_arrow_right.svg';

// 데스크톱/모바일 환경에 따른 데이터 요청 개수 정의
const DESKTOP_PAGE_SIZE = 4;
const MOBILE_PAGE_SIZE = 6;

const DonateSection = () => {
  const didMountRef = useRef(false);
  const isLoadingRef = useRef(false); // isLoading을 ref로 관리
  const [donateList, setDonateList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();

  // 반응형: 1200px 미만에서는 모바일로 간주
  const isMobile = width < 1200;

  // 모바일/데스크톱 환경에 따라 데이터 요청 개수(size) 결정
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const loadDonation = useCallback(async () => {
    // 현재 로딩 중이거나, 모바일 환경에서 더 이상 데이터가 없다면 즉시 종료
    // ref를 사용해서 중복 호출 방지
    if (isLoadingRef.current || (isMobile && !hasMore)) return;

    setIsLoading(true);

    const result = await apiCall(getDonations, pageSize, cursor, null);
    if (result) {
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
    }

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
      setCurrentPage(0); // 첫 페이지로 이동
    }

    isLoadingRef.current = false;
    setIsLoading(false);
  };

  // 다음 페이지로 이동 (데스크톱 전용)
  const handleNext = async () => {
    if (isLoadingRef.current || isMobile) return;

    const nextPage = currentPage + 1;
    const nextStartIndex = nextPage * DESKTOP_PAGE_SIZE;

    // 다음 페이지의 데이터가 이미 로드되어 있는 경우
    if (nextStartIndex < donateList.length) {
      setCurrentPage(nextPage);
    }
    // 다음 페이지의 데이터가 없지만 API에서 더 불러올 수 있는 경우
    else if (hasMore) {
      await loadDonation();
      setCurrentPage(nextPage);
    }
  };

  // 이전 페이지로 이동 (데스크톱 전용)
  const handlePrev = () => {
    if (isLoadingRef.current || isMobile) return;

    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 현재 페이지에 보여줄 아이템들 (데스크톱 전용)
  const startIndex = currentPage * DESKTOP_PAGE_SIZE;
  const endIndex = startIndex + DESKTOP_PAGE_SIZE;
  const currentItems = donateList.slice(startIndex, endIndex);

  // 첫 페이지인지 확인 (데스크톱 전용)
  const isFirstPage = currentPage === 0;

  // 마지막 페이지인지 확인 (데스크톱 전용)
  const isLastPage = endIndex >= donateList.length && !hasMore;

  // 초기 로드 및 화면 크기 변경 시 처리
  useEffect(() => {
    // 개발 환경에서 Strict Mode로 인한 이중 호출 방지 로직
    if (process.env.NODE_ENV === 'development' && !didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    // width가 0이 아닐 때
    if (width !== 0) {
      // 화면 크기 변경 시 데이터 리셋하고 다시 로드
      const resetAndLoad = async () => {
        // 상태 초기화
        setDonateList([]);
        setCursor(null);
        setHasMore(true);
        setCurrentPage(0);

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
    if (!isMobile) return () => {};

    const donateListBox = document.querySelector('.donateList');
    if (!donateListBox) return () => {};

    const handleScroll = () => {
      // hasMore가 false거나 로딩 중이면 스크롤 이벤트 무시
      if (!hasMore || isLoadingRef.current) return;

      // 스크롤이 리스트의 끝에 도달하기 전에 미리 로드 (가로 스크롤)
      const remainingScroll =
        donateListBox.scrollWidth -
        (donateListBox.scrollLeft + donateListBox.clientWidth);

      // 남은 스크롤 거리가 300px 이하일 때 로드 시작
      const isNearEnd = remainingScroll <= 300;

      if (isNearEnd) {
        loadDonation();
      }
    };

    donateListBox.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      donateListBox.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, hasMore, loadDonation]);

  return (
    <section className="donateSection">
      <h2 className="donateSectionTitle">후원을 기다리는 조공</h2>
      <div className="donateBox">
        {!isMobile && !isFirstPage && (
          <button
            className="donateNavBtn"
            onClick={handlePrev}
            disabled={isLoading}
          >
            <img src={arrowLeft} alt="이전" />
          </button>
        )}
        <div className="donateList">
          {isMobile // 모바일: 전체 리스트 표시 (가로 스크롤)
            ? donateList.map(donation => (
                <Donate
                  key={donation.id}
                  donation={donation}
                  onDonateSuccess={refreshDonations}
                />
              ))
            : // 데스크톱: 페이지네이션된 리스트
              currentItems.map(donation => (
                <Donate
                  key={donation.id}
                  donation={donation}
                  onDonateSuccess={refreshDonations}
                />
              ))}
        </div>
        {!isMobile && !isLastPage && (
          <button
            className="donateNavBtn"
            onClick={handleNext}
            disabled={isLoading}
          >
            <img src={arrowRight} alt="다음" />
          </button>
        )}
      </div>
    </section>
  );
};

export default DonateSection;
