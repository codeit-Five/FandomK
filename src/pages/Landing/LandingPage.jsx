import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';
import logo from '../../assets/image/logo/fandom-klogo.svg';
import bg from '../../assets/image/landing-bg.svg';
import landing1_1_img from '../../assets/image/landing-1-1.png';
import landing2_1_img from '../../assets/image/landing2-1.png';
import landing3_1_img from '../../assets/image/landing3-1.png';
import newBg from '../../assets/image/landing-bottom.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/list');
  };

  const landingRef = useRef();
  const sec02Ref = useRef();
  const sec03Ref = useRef();
  const sec04Ref = useRef();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    setActiveSection('sec01');
    const handleScroll = () => {
      const scrollTop = landingRef.current.scrollTop;
      const sec02Top = sec02Ref.current.offsetTop;
      const sec03Top = sec03Ref.current.offsetTop;
      const sec04Top = sec04Ref.current.offsetTop;

      if (scrollTop >= sec04Top) {
        setActiveSection('sec04');
      } else if (scrollTop >= sec03Top) {
        setActiveSection('sec03');
      } else if (scrollTop >= sec02Top) {
        setActiveSection('sec02');
      } else {
        setActiveSection('sec01');
      }
    };

    const scrollDiv = landingRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollDiv) {
        scrollDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // 스크롤 top
  const scrollToTop = () => {
    landingRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-wrap" ref={landingRef}>
      <div className={`landing ${activeSection === 'sec01' ? 'active' : ''}`}>
        <div
          className="background-image main-bg"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>
        <div className="overlay overlay-main">
          <div className="landing-header">
            <p className="subtitle">
              내가 좋아하는 아이돌을 <br />
              가장 <span className="highlight">쉽게 덕질</span>하는 방법
            </p>
            <img
              src={logo}
              alt="Fandom-K Logo"
              className="logo"
              onClick={handleStart}
            />
          </div>
          <div className="button-container">
            <button className="start-btn" onClick={handleStart}>
              지금 시작하기
            </button>
          </div>
        </div>
      </div>
      <div
        className={`landing-section-2 ${activeSection === 'sec02' ? 'active' : ''}`}
        ref={sec02Ref}
      >
        <div
          className="background-image bg-section-2"
          style={{ backgroundImage: `url(${newBg})` }}
        ></div>
        <div className="overlay-2">
          <p className="slogan">후원하기</p>
          <p className="slogan-subtitle">
            좋아하는 아이돌에게
            <br />
            쉽게 조공해 보세요
          </p>
          <img
            src={landing1_1_img}
            alt="landing page section 1"
            className="landing-image"
          />
        </div>
      </div>
      <div
        className={`landing-section-3 ${activeSection === 'sec03' ? 'active' : ''}`}
        ref={sec03Ref}
      >
        <div
          className="background-image bg-section-3"
          style={{ backgroundImage: `url(${newBg})` }}
        ></div>
        <div className="overlay-3">
          <p className="slogan">이달의 아티스트</p>
          <p className="slogan-subtitle">
            내 아티스트에게 1등의
            <br />
            영예를 선물하세요
          </p>
          <img
            src={landing2_1_img}
            alt="landing page section 2"
            className="landing-image"
          />
        </div>
      </div>
      <div
        className={`landing-section-4 ${activeSection === 'sec04' ? 'active' : ''}`}
        ref={sec04Ref}
      >
        <div
          className="background-image bg-section-4"
          style={{ backgroundImage: `url(${newBg})` }}
        ></div>
        <div className="overlay-4">
          <p className="slogan">나만의 아티스트</p>
          <p className="slogan-subtitle">
            좋아하는 아티스트들의
            <br />
            소식을 모아보세요
          </p>
          <img
            src={landing3_1_img}
            alt="landing page section 3"
            className="landing-image"
          />
        </div>

        <button className="btnTop" onClick={scrollToTop}>
          <span className="blind">위로가기</span>
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
