import api from './baseApi';

// 투표 생성
export default async function postVotes(idolId) {
  const res = await api.post('/votes', { idolId });
  return res.data;
}
