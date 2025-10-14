import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiCall } from '@/apis/baseApi';
import getCharts from '@/apis/chartsApi';
import postVotes from '@/apis/votesApi';
import useWindowSize from '@/hooks/useWindowSize';
import useCredit from '@/stores/creditIndex';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import IdolCard from '@/components/IdolCard/IdolCard';
import OptionCard from '@/components/OptionCard/OptionCard';
import '../../../components/IdolCard/IdolCard.scss';
import './ChartSection.scss';

const ChartSection = () => {
  const VOTE_CREDIT = 1000;

  const [gender, setGender] = useState('female');
  const [chartList, setChartList] = useState([]);
  const [popChartList, setPopChartList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [selectedIdol, setSelectedIdol] = useState(null);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { width } = useWindowSize();
  const { credit, decreaseCredit } = useCredit(state => state);

  // 해상도별 페이지
  function setPaseSize() {
    if (width < 640) return 5; // Mobile: 5개
    if (width < 1200) return 5; // Tablet: 5개
    return 10; // Desktop: 10개
  }

  // 아이돌 조회
  async function loadIdols(
    gender,
    cursor = null,
    pageSize = 5,
    isLoadMore = false,
  ) {
    const result = await apiCall(getCharts, gender, cursor, pageSize);
    if (result) {
      if (isLoadMore) {
        setChartList(prev => [...prev, ...result.idols]);
      } else {
        setChartList(result.idols); // 새로 로드: 새로운 데이터만
      }
      setCursor(result.nextCursor);
      setIsLoading(false);
    }
  }

  // 차트 성별 변경
  const handleChartChange = newGender => {
    if (newGender === gender) return;
    setGender(newGender);
    setCursor(null);
    setIsLoading(true);
  };

  // 차트 더보기
  const handleListMore = () => {
    loadIdols(gender, cursor, setPaseSize(), true); // isLoadMore = true
  };

  // 차트팝업 아이돌 조회
  async function loadPopIdols(gender, cursor, pageSize) {
    const result = await apiCall(getCharts, gender, cursor, pageSize);
    if (result) {
      setPopChartList(result.idols);
      setIsLoading(false);
    }
  }
  // 차트팝업 open
  const handleOpen = () => {
    loadPopIdols(gender, null, 150);
    setIsChartOpen(true);
    setIsLoading(true);
  };
  // 차트팝업 close
  const handleClose = () => {
    setIsChartOpen(false);
    setSelectedIdol('');
  };

  // 차트팝업 투표하기
  const handleVotes = () => {
    async function postIdolVotes(idolId) {
      const result = await apiCall(postVotes, idolId);
      if (result) {
        loadIdols(gender, null, setPaseSize());
      }
    }

    if (credit >= 1000) {
      if (!selectedIdol) {
        toast.error('선택된 아이돌이 없습니다.');
        return;
      }
      decreaseCredit(VOTE_CREDIT);
      postIdolVotes(selectedIdol);
    } else {
      setIsConfirmOpen(true);
    }
    handleClose();
  };

  // 크래잇컨펌 close
  const handleConfirmClose = () => setIsConfirmOpen(false);

  useEffect(() => {
    loadIdols(gender, null, setPaseSize());

    // 차트 정렬
    const sortedChartList = [...chartList].sort(
      (a, b) => b.totalVotes - a.totalVotes,
    );
    setChartList(sortedChartList);
  }, [gender, width]);

  return (
    <section className="chartWarp inner">
      <div className="titWrap">
        <h1 className="tit">이달의 차트</h1>
        <Button variant="voteChart" onClick={handleOpen} />
      </div>
      <div className="chartBtns">
        <button
          className={`btnTab  ${gender === 'female' ? 'active' : ''}`}
          onClick={() => handleChartChange('female')}
        >
          이달의 여자 아이돌
        </button>
        <button
          className={`btnTab  ${gender === 'male' ? 'active' : ''}`}
          onClick={() => handleChartChange('male')}
        >
          이달의 남자 아이돌
        </button>
      </div>
      <ul className="chartList">
        {isLoading
          ? Array.from({ length: setPaseSize() }).map((_, index) => (
              <li key={`skeleton${index}`}>
                <SkeletonIdolCard />
              </li>
            ))
          : chartList.map((item, index) => {
              const { id, name, group, profilePicture, totalVotes } = item;
              return (
                <li key={id}>
                  <IdolCard
                    variant="chart"
                    imgUrl={profilePicture}
                    rankInfo={{ rank: index + 1, voteCount: totalVotes }}
                    profileInfo={{ groupName: group, idolName: name }}
                  />
                </li>
              );
            })}
      </ul>
      {cursor && (
        <button className="btnChartMore" onClick={handleListMore}>
          더 보기
        </button>
      )}

      {/* 차트투표팝업 */}
      <Modal
        variant="vote"
        title={`이달의 ${gender === 'female' ? '여자' : '남자'} 아이돌`}
        isOpen={isChartOpen}
        onClose={handleClose}
        isHasBottomContent
        onClick={handleVotes}
      >
        <ul className="chartList">
          {isLoading
            ? Array.from({ length: 15 }).map((_, index) => (
                <li key={`skeleton${index}`}>
                  <SkeletonIdolCard />
                </li>
              ))
            : popChartList.map((item, index) => {
                const { id, name, group, profilePicture, totalVotes } = item;
                return (
                  <li key={id}>
                    <OptionCard
                      variant="chart"
                      isRadioDisplay
                      radioInfo={{
                        id,
                        name: 'idolOption',
                        selected: selectedIdol,
                        setSelected: setSelectedIdol,
                      }}
                      idolCardInfo={{
                        imgUrl: profilePicture,
                        rankInfo: { rank: index + 1, voteCount: totalVotes },
                        profileInfo: { groupName: group, idolName: name },
                      }}
                    />
                  </li>
                );
              })}
        </ul>
      </Modal>

      {/* 크레딧 부족 */}
      <Modal
        variant="confirm"
        bottomBtn="확인"
        isOpen={isConfirmOpen}
        onClose={handleConfirmClose}
        onClick={handleConfirmClose}
      >
        <div className="creditConfirm">
          앗! 투표하기 위한 <span>크레딧</span>이 부족해요
        </div>
      </Modal>
    </section>
  );
};

export default ChartSection;

export const SkeletonIdolCard = () => {
  // 스켈레톤 색상 정의
  const BASE_COLOR = '#333';
  const HIGHLIGHT_COLOR = '#444';

  return (
    <div className="idolCardChart">
      <div className="idolCardImgContainer">
        <Skeleton
          circle
          className="idolCardImgBox"
          baseColor={BASE_COLOR}
          highlightColor={HIGHLIGHT_COLOR}
        />
      </div>
      <Skeleton
        width={7}
        height={19}
        style={{ margin: '0 12px' }}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />
      <Skeleton
        width={70}
        height={19}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />
      <div className="voteCount">
        <Skeleton
          width={35}
          height={19}
          baseColor={BASE_COLOR}
          highlightColor={HIGHLIGHT_COLOR}
        />
      </div>
    </div>
  );
};
