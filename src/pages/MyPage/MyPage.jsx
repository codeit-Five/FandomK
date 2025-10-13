import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import IdolCard from '../../components/IdolCard/IdolCard';
import Button from '../../components/Button/Button';
import { apiCall } from '../../apis/baseApi';
import { getIdols } from '../../apis/idolsApi';
import prevIcon from '../../assets/image/icons/ic_btn_prev.svg';
import './MyPage.scss';

// 한 페이지에 보여줄 아이돌 카드 개수
const IDOLS_PER_PAGE = 16; // 추천 아이돌 목록
const MY_IDOLS_PER_PAGE = 8; // 내 관심 아이돌 목록

export default function MyPage() {
  // --- STATE VARIABLES --- //

  // 내 관심 아이돌 목록. localStorage에서 초기값을 불러옴.
  const [myIdols, setMyIdols] = useState(() => {
    const savedIdols = localStorage.getItem('myIdols');
    return savedIdols ? JSON.parse(savedIdols) : [];
  });

  // 추천 목록에서 선택된 아이돌 목록
  const [selectedIdols, setSelectedIdols] = useState([]);

  // 현재 페이지 번호 (추천 아이돌, 내 관심 아이돌)
  const [currentPage, setCurrentPage] = useState(0);
  const [myIdolsPage, setMyIdolsPage] = useState(0);

  // API로부터 받아온 전체 아이돌 목록
  const [allIdols, setAllIdols] = useState([]);
  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState(null);

  // --- EFFECTS --- //

  // 컴포넌트 마운트 시 전체 아이돌 목록을 API로부터 가져옴
  useEffect(() => {
    const fetchIdols = async () => {
      try {
        setIsLoading(true);
        const response = await apiCall(getIdols, null, 100, '');
        setAllIdols(response.list || []);
        setError(null);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdols();
  }, []);

  // myIdols 상태가 변경될 때마다 localStorage에 저장하여 데이터 유지
  useEffect(() => {
    localStorage.setItem('myIdols', JSON.stringify(myIdols));
  }, [myIdols]);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(allIdols.length / IDOLS_PER_PAGE);
  const myIdolsTotalPages = Math.ceil(myIdols.length / MY_IDOLS_PER_PAGE);

  // 현재 페이지에 보여줄 아이돌 목록 계산
  const startIndex = currentPage * IDOLS_PER_PAGE;
  const currentIdols = allIdols.slice(startIndex, startIndex + IDOLS_PER_PAGE);

  const myIdolsStartIndex = myIdolsPage * MY_IDOLS_PER_PAGE;
  const currentMyIdols = myIdols.slice(
    myIdolsStartIndex,
    myIdolsStartIndex + MY_IDOLS_PER_PAGE,
  );

  // 추천 아이돌 선택/해제 핸들러
  const handleSelectIdol = idol => {
    if (selectedIdols.find(selected => selected.name === idol.name)) {
      // 이미 선택된 아이돌이면 선택 해제
      setSelectedIdols(
        selectedIdols.filter(selected => selected.name !== idol.name),
      );
    } else {
      // 새로운 아이돌 선택
      setSelectedIdols([...selectedIdols, idol]);
    }
  };

  // 선택된 아이돌을 내 관심 목록에 추가하는 핸들러
  const handleAddIdols = () => {
    const newIdols = selectedIdols.filter(
      // 이미 내 목록에 있는 아이돌은 제외
      selected => !myIdols.find(myIdol => myIdol.name === selected.name),
    );
    setMyIdols([...myIdols, ...newIdols]);
    setSelectedIdols([]); // 선택 목록 초기화
  };

  // 내 관심 아이돌 목록에서 제거하는 핸들러
  const handleRemoveIdol = idolToRemove => {
    const newMyIdols = myIdols.filter(idol => idol.name !== idolToRemove.name);
    setMyIdols(newMyIdols);

    // 아이돌 제거 후 현재 페이지가 비어있게 되면 이전 페이지로 이동
    const newTotalPages = Math.ceil(newMyIdols.length / MY_IDOLS_PER_PAGE);
    if (myIdolsPage >= newTotalPages) {
      setMyIdolsPage(Math.max(newTotalPages - 1, 0));
    }
  };

  // 추천 아이돌 목록 페이지네이션 핸들러
  const handleNextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  // 내 관심 아이돌 목록 페이지네이션 핸들러
  const handleMyIdolsNextPage = () => {
    setMyIdolsPage(prev => (prev + 1) % myIdolsTotalPages);
  };

  const handleMyIdolsPrevPage = () => {
    setMyIdolsPage(prev => (prev - 1 + myIdolsTotalPages) % myIdolsTotalPages);
  };

  return (
    <>
      <Header />
      <main className="myPageContainer">
        {/* 내가 관심있는 아이돌 섹션 */}
        <section className="myIdolsSection">
          <h2 className="sectionTitle">
            내가 관심있는 아이돌 ({myIdols.length})
          </h2>
          <div className="interestIdolsContainer">
            <button
              className="navButton prevButton"
              onClick={handleMyIdolsPrevPage}
              disabled={myIdolsTotalPages <= 1}
            >
              <img src={prevIcon} alt="Previous" />
            </button>
            <div className="idolList interestList">
              {myIdols.length === 0 ? (
                <div className="emptyListMessage">
                  관심있는 아이돌을 추가해 주세요
                </div>
              ) : (
                currentMyIdols.map(idol => (
                  <IdolCard
                    key={idol.id}
                    variant="interest"
                    imgUrl={idol.profilePicture}
                    profileInfo={{
                      idolName: idol.name,
                      groupName: idol.group,
                    }}
                    isShowBtn // 제거 버튼 표시
                    onRemove={() => handleRemoveIdol(idol)}
                  />
                ))
              )}
            </div>
            <button
              className="navButton nextButton"
              onClick={handleMyIdolsNextPage}
              disabled={myIdolsTotalPages <= 1}
            >
              <img src={prevIcon} alt="Next" />
            </button>
          </div>
        </section>

        {/* 추천 아이돌 섹션 */}
        <section className="recommendIdolsSection">
          <h2 className="sectionTitle">관심 있는 아이돌을 추가해보세요</h2>
          {isLoading ? (
            <div className="message">로딩 중...</div>
          ) : error ? (
            <div className="message error">{error}</div>
          ) : (
            <div className="recommendIdolsContainer">
              <button
                className="navButton prevButton"
                onClick={handlePrevPage}
                disabled={totalPages <= 1}
              >
                <img src={prevIcon} alt="Previous" />
              </button>
              <div className="idolList recommendList">
                {currentIdols.map(idol => (
                  <IdolCard
                    key={idol.id}
                    variant="recommend"
                    imgUrl={idol.profilePicture}
                    profileInfo={{
                      idolName: idol.name,
                      groupName: idol.group,
                    }}
                    // 현재 선택되었는지 여부
                    isSelected={
                      !!selectedIdols.find(selected => selected.id === idol.id)
                    }
                    // 이미 내 관심 목록에 추가되었는지 여부 (반투명 처리)
                    isAdded={myIdols.some(myIdol => myIdol.id === idol.id)}
                    onClick={() => handleSelectIdol(idol)}
                  />
                ))}
              </div>
              <button
                className="navButton nextButton"
                onClick={handleNextPage}
                disabled={totalPages <= 1}
              >
                <img src={prevIcon} alt="Next" />
              </button>
            </div>
          )}
          <div className="addButtonContainer">
            <Button
              variant="add"
              onClick={handleAddIdols}
              isDisabled={selectedIdols.length === 0}
            />
          </div>
        </section>
      </main>
    </>
  );
}
