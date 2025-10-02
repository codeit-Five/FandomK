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
    <div className="landing" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <p className="subtitle">
          내가 좋아하는 아이돌을 <br />
          가장 <span className="highlight">쉽게 덕질</span>하는 방법
        </p>
        <img src={logo} alt="Fandom-K Logo" className="logo" onClick={handleStart} />

        <button className="start-btn" onClick={handleStart}>
          지금 시작하기
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
