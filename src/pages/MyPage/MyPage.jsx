import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import IdolCard from '../../components/IdolCard/IdolCard';
import Button from '../../components/Button/Button';
import { apiCall } from '../../apis/baseApi';
import { getIdols } from '../../apis/idolsApi';
import useWindowSize from '../../hooks/useWindowSize';
import prevIcon from '../../assets/image/icons/ic_btn_prev.svg';
import './MyPage.scss';

// 추천 아이돌 수
const DESKTOP_IDOLS_PER_PAGE = 16;
const MOBILE_IDOLS_PER_PAGE = 4;
// 내 관심 아이돌 수
const DESKTOP_MY_IDOLS_PER_PAGE = 8;
const MOBILE_MY_IDOLS_PER_PAGE = 2;

export default function MyPage() {
  // useWindowSize 훅을 사용하여 브라우저 창의 너비를 실시간으로 가져옴
  const { width } = useWindowSize();

  // 내 관심 아이돌 목록 상태. 페이지가 로드될 때 localStorage에서 저장된 값을 불러와 초기화
  const [myIdols, setMyIdols] = useState(() => {
    const savedIdols = localStorage.getItem('myIdols');
    return savedIdols ? JSON.parse(savedIdols) : [];
  });

  const [selectedIdols, setSelectedIdols] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [myIdolsPage, setMyIdolsPage] = useState(0);
  const [allIdols, setAllIdols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 현재 화면이 모바일 크기인지 여부
  const isMobile = width <= 768;
  // 화면 크기에 따라 추천 아이돌 목록의 페이지당 아이돌 수를 동적으로 설정
  const IDOLS_PER_PAGE = isMobile
    ? MOBILE_IDOLS_PER_PAGE
    : DESKTOP_IDOLS_PER_PAGE;
  // 화면 크기에 따라 내 관심 아이돌 목록의 페이지당 아이돌 수를 동적으로 설정
  const MY_IDOLS_PER_PAGE = isMobile
    ? MOBILE_MY_IDOLS_PER_PAGE
    : DESKTOP_MY_IDOLS_PER_PAGE;

  // 컴포넌트가 처음 마운트될 때 전체 아이돌 목록을 API로부터 가져옴
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

  useEffect(() => {
    localStorage.setItem('myIdols', JSON.stringify(myIdols));
  }, [myIdols]);

  // 추천 아이돌 목록의 전체 페이지 수
  const totalPages = Math.ceil(allIdols.length / IDOLS_PER_PAGE);
  // 내 관심 아이돌 목록의 전체 페이지 수
  const myIdolsTotalPages = Math.ceil(myIdols.length / MY_IDOLS_PER_PAGE);

  // 현재 페이지에 보여줄 추천 아이돌 목록 계산
  const startIndex = currentPage * IDOLS_PER_PAGE;
  const currentIdols = allIdols.slice(startIndex, startIndex + IDOLS_PER_PAGE);

  // 현재 페이지에 보여줄 내 관심 아이돌 목록 계산
  const myIdolsStartIndex = myIdolsPage * MY_IDOLS_PER_PAGE;
  const currentMyIdols = myIdols.slice(
    myIdolsStartIndex,
    myIdolsStartIndex + MY_IDOLS_PER_PAGE,
  );

  // 추천 아이돌 카드를 클릭했을 때 선택/해제하는 함수
  const handleSelectIdol = idol => {
    if (selectedIdols.find(selected => selected.name === idol.name)) {
      setSelectedIdols(
        selectedIdols.filter(selected => selected.name !== idol.name),
      );
    } else {
      setSelectedIdols([...selectedIdols, idol]);
    }
  };

  // '추가하기' 버튼 클릭 시, 선택된 아이돌들을 '내 관심 아이돌' 목록에 추가하는 함수
  const handleAddIdols = () => {
    const newIdols = selectedIdols.filter(
      selected => !myIdols.find(myIdol => myIdol.name === selected.name),
    );
    setMyIdols([...myIdols, ...newIdols]);
    setSelectedIdols([]);
  };

  // '내 관심 아이돌' 목록에서 아이돌을 제거하는 함수
  const handleRemoveIdol = idolToRemove => {
    const newMyIdols = myIdols.filter(idol => idol.name !== idolToRemove.name);
    setMyIdols(newMyIdols);

    // 아이돌 제거 후 현재 페이지가 비어있게 되면, 이전 페이지로 이동
    const newTotalPages = Math.ceil(newMyIdols.length / MY_IDOLS_PER_PAGE);
    if (myIdolsPage >= newTotalPages) {
      setMyIdolsPage(Math.max(newTotalPages - 1, 0));
    }
  };

  // 다음과 이전으로 이동하는 함수
  const handleNextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

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
            {/* 이전 페이지 버튼 */}
            <button
              className="navButton prevButton"
              onClick={handleMyIdolsPrevPage}
              disabled={myIdolsTotalPages <= 1}
            >
              <img src={prevIcon} alt="Previous" />
            </button>
            <div className="idolList interestList">
              {/* 목록이 비었을 때와 아닐 때를 구분하여 렌더링 */}
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
                    isShowBtn // 카드에 제거 버튼 표시
                    onRemove={() => handleRemoveIdol(idol)}
                  />
                ))
              )}
            </div>
            {/* 다음 페이지 버튼 */}
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
          {/* 로딩 및 에러 상태에 따른 조건부 렌더링 */}
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
                    // 현재 선택된 아이돌인지 여부를 전달하여 카드 스타일 변경
                    isSelected={
                      !!selectedIdols.find(selected => selected.id === idol.id)
                    }
                    // 이미 내 관심 목록에 추가된 아이돌인지 여부를 전달하여 카드 스타일 변경 (반투명 처리)
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
            {/* 선택된 아이돌이 있을 때만 버튼 활성화 */}
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
