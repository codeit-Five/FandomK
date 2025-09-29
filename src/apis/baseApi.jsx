import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
  baseURL: 'https://fandom-k-api.vercel.app/19-5',
  timeout: 3000,
});

// 응답 인터셉터로 공통 에러 로깅 및 처리
api.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMessage = data?.message || '잘못된 요청입니다.';
          break;
        case 401:
          errorMessage = '인증이 필요합니다.';
          break;
        case 403:
          errorMessage = '권한이 없습니다.';
          break;
        case 404:
          errorMessage = '요청한 리소스를 찾을 수 없습니다.';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다.';
          break;
        default:
          errorMessage = data?.message || '오류가 발생했습니다.';
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      errorMessage = '서버로부터 응답이 없습니다.';
    }

    // 에러 알럿 표시
    toast.error(errorMessage);

    return Promise.reject(error);
  },
);

// API 함수호출
export async function apiCall(apiFunc, ...args) {
  try {
    const result = await apiFunc(...args);
    return result;
  } catch (error) {
    return null;
  }
}

export default api;
