import api from './baseApi';

// 조회
export default async function postVotes(idolId) {
  const res = await api.post('/votes', { idolId });
  return res.data;
}
