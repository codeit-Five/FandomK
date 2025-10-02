import './assets/styles/App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApiTemplate from './apis/ApiTemplate';
import LandingPage from './pages/Landing/LandingPage';
import ListPage from './pages/List/ListPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import MyPage from './pages/MyPage/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
