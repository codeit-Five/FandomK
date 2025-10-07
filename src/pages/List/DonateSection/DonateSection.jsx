import { useState, useEffect, useRef } from 'react';
import Donate from '../Donate/Donate';
import { apiCall } from '../../../apis/baseApi';
import { getDonations } from '../../../apis/donationsApi';
import './DonateSection.scss';
import arrowLeft from '../../../assets/image/icons/ic_arrow_left.svg';
import arrowRight from '../../../assets/image/icons/ic_arrow_right.svg';

const PAGE_SIZE = 4;

const DonateSection = () => {
  const didMountRef = useRef(false);
  const [donateList, setDonateList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function loadDonation() {
    setIsLoading(true);
    const result = await apiCall(getDonations, PAGE_SIZE, cursor, null);
    if (result) {
      setDonateList(prev => [...prev, ...result.list]);
      setCursor(result.nextCursor);
      setHasMore(result.nextCursor !== null);
    }
    setIsLoading(false);
  }

  // 후원 후 데이터 새로고침
  const refreshDonations = async () => {
    setIsLoading(true);
    // 처음부터 다시 로드
    const result = await apiCall(getDonations, PAGE_SIZE, null, null);
    if (result) {
      setDonateList(result.list);
      setCursor(result.nextCursor);
      setHasMore(result.nextCursor !== null);
      setCurrentPage(0); // 첫 페이지로 이동
    }
    setIsLoading(false);
  };

  // 다음 페이지로 이동
  const handleNext = async () => {
    if (isLoading) return;

    const nextPage = currentPage + 1;
    const nextStartIndex = nextPage * PAGE_SIZE;

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

  // 이전 페이지로 이동
  const handlePrev = () => {
    if (isLoading) return;

    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 현재 페이지에 보여줄 아이템들
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentItems = donateList.slice(startIndex, endIndex);

  // 첫 페이지인지 확인
  const isFirstPage = currentPage === 0;

  // 마지막 페이지인지 확인
  const isLastPage = endIndex >= donateList.length && !hasMore;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !didMountRef.current) {
      didMountRef.current = true;
      return; // 첫 번째 실행은 여기서 종료 (POST 방지)
    }

    loadDonation();
  }, []);

  return (
    <section className="donateSection">
      <h2 className="donateSectionTitle">후원을 기다리는 조공</h2>
      <div className="donateBox">
        {!isFirstPage && (
          <button
            className="donateNavBtn"
            onClick={handlePrev}
            disabled={isLoading}
          >
            <img src={arrowLeft} alt="donate Nav btn" />
          </button>
        )}
        <div className="donateList">
          {currentItems.map(donation => (
            <Donate
              key={donation.id}
              donation={donation}
              onDonateSuccess={refreshDonations}
            />
          ))}
        </div>
        {!isLastPage && (
          <button
            className="donateNavBtn"
            onClick={handleNext}
            disabled={isLoading}
          >
            <img src={arrowRight} alt="arrow right" />
          </button>
        )}
      </div>
    </section>
  );
};

export default DonateSection;
