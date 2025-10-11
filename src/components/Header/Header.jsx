import { Link } from 'react-router-dom';
import logo from '../../assets/image/logo/fandom-klogo.svg';
import profile from '../../assets/image/common/img_profile.svg';
import favicon from '../../../favicon.svg';
import './Header.scss';

function Header() {
  return (
    <header>
      <div className="headerContainer">
        <Link to="/list" className="logo">
          <img src={logo} alt="FandomK logo" />
        </Link>
        <div className="util">
          <Link to="/">
            <img src={favicon} alt="landing" />
          </Link>
          <Link to="/mypage" className="profile">
            <img src={profile} alt="profile" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
