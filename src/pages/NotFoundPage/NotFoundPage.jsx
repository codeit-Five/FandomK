import { Link, useNavigate } from 'react-router-dom';
import './NotFoundPage.scss';
import logo from '../../assets/image/logo/fandom-klogo.svg';

function NotFoundPage() {
  const navigate = useNavigate();

  // navigate(-1)을 호출하면 브라우저의 이전 기록으로 돌아갑니다 (뒤로 가기).
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notFoundContainer">
      <img src={logo} alt="FandomK logo" />
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <div className="notFoundBtn">
        <button onClick={handleGoBack}>← 이전 페이지로</button>
        <Link to="/">
          <button>랜딩 페이지로</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
