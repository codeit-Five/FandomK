import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LandingPage from '@/pages/Landing/LandingPage';
import ListPage from '@/pages/List/ListPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import MyPage from '@/pages/MyPage/MyPage';
import './assets/styles/App.scss';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <div id="modalRoot" />

      <ToastContainer autoClose={2000} theme="dark" />
    </>
  );
}

export default App;
