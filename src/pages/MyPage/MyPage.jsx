
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import IdolCard from '../../components/IdolCard/IdolCard';
import Button from '../../components/Button/Button';
import { apiCall } from '../../apis/baseApi';
import { getIdols } from '../../apis/idolsApi';
import prevIcon from '../../assets/image/icons/ic_btn_prev.svg';
import './MyPage.scss';

const IDOLS_PER_PAGE = 16;

export default function MyPage() {
  const [myIdols, setMyIdols] = useState([]);
  const [selectedIdols, setSelectedIdols] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [allIdols, setAllIdols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const totalPages = Math.ceil(allIdols.length / IDOLS_PER_PAGE);

  const handleSelectIdol = (idol) => {
    if (selectedIdols.find((selected) => selected.name === idol.name)) {
      setSelectedIdols(
        selectedIdols.filter((selected) => selected.name !== idol.name),
      );
    } else {
      setSelectedIdols([...selectedIdols, idol]);
    }
  };

  const handleAddIdols = () => {
    const newIdols = selectedIdols.filter(
      (selected) => !myIdols.find((myIdol) => myIdol.name === selected.name),
    );
    setMyIdols([...myIdols, ...newIdols]);
    setSelectedIdols([]);
  };

  const handleRemoveIdol = (idolToRemove) => {
    setMyIdols(myIdols.filter((idol) => idol.name !== idolToRemove.name));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * IDOLS_PER_PAGE;
  const currentIdols = allIdols.slice(startIndex, startIndex + IDOLS_PER_PAGE);

  return (
    <>
      <Header />
      <main className="myPageContainer">
        <section className="myIdolsSection">
          <h2 className="sectionTitle">내가 관심있는 아이돌</h2>
          <div className="idolList interestList">
            {myIdols.map((idol) => (
              <IdolCard
                key={idol.id} // key를 고유한 id로 변경
                variant="interest"
                imgUrl={idol.profilePicture}
                profileInfo={{
                  idolName: idol.name,
                  groupName: idol.group,
                }}
                isShowBtn={true}
                onRemove={() => handleRemoveIdol(idol)}
              />
            ))}
          </div>
        </section>

        <section className="recommendIdolsSection">
          <h2 className="sectionTitle">관심 있는 아이돌을 추가해보세요.</h2>
          {isLoading ? (
            <div className="message">로딩 중...</div>
          ) : error ? (
            <div className="message error">{error}</div>
          ) : (
            <div className="recommendIdolsContainer">
              <button className="navButton prevButton" onClick={handlePrevPage} disabled={totalPages <= 1}>
                <img src={prevIcon} alt="Previous" />
              </button>
              <div className="idolList recommendList">
                {currentIdols.map((idol) => (
                  <IdolCard
                    key={idol.id} // key를 고유한 id로 변경
                    variant="recommend"
                    imgUrl={idol.profilePicture}
                    profileInfo={{
                      idolName: idol.name,
                      groupName: idol.group,
                    }}
                    isSelected={!!selectedIdols.find((selected) => selected.id === idol.id)}
                    onClick={() => handleSelectIdol(idol)}
                  />
                ))}
              </div>
              <button className="navButton nextButton" onClick={handleNextPage} disabled={totalPages <= 1}>
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
