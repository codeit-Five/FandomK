import logo from "../../assets/image/logo/fandom-klogo.svg";
import profile from "../../assets/image/profile-image.png";
import "./Header.scss";

function Header() {
  return (
    <header>
      <div className="headerContainer">
        <a href="/list" className="logo">
          <img src={logo} alt="FandomK logo" />
        </a>
        <a href="/mypage" className="profile">
          <img src={profile} alt="profile" />
        </a>
      </div>
    </header>
  );
}

export default Header;
