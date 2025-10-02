import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';
import logo from '../../assets/image/logo/fandom-klogo.svg';
import bg from '../../assets/image/landing-bg.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/list');
  };

  return (
    <>
    <div className="landing" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <p className="subtitle">
          내가 좋아하는 아이돌을 <br />
          가장 <span className="highlight">쉽게 덕질</span>하는 방법
        </p>
        <img src={logo} alt="Fandom-K Logo" className="logo" onClick={handleStart} />
        {/* 아니 ㅋㅋㅋ 이거 br 이러면 안되는거 아는데 css능력이 딸려서 이렇게 일단 해놨어요 ㅠㅠ 보고 너무 웃지 말아줘요... 백그라운드 이미지 opacity 70퍼도 해야함 ㅠ */}
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

        {/* 랜딩페이지에서만 써서 따로 컴포넌트 제작안하고 만듬 */}
        <button className="start-btn" onClick={handleStart}>
          지금 시작하기
        </button>
      </div>
    </div>
    </>
  );
}

export default LandingPage;
