import api from './baseApi';

// 아이돌 조회
export async function getIdols(cursor = null, pageSize = 10, keyword = null) {
  const res = await api.get('/idols', {
    params: { cursor, pageSize, keyword },
  });
  return res.data;
}

// 아이돌 생성
export async function postIdols(data) {
  const res = await api.post('/idols', data);
  return res.data;
}

// 아이돌 수정
export async function putIdols(id, data) {
  const res = await api.put(`/idols/${id}`, data);
  return res.data;
}

// 아이돌 삭제
export async function deleteIdols(id) {
  const res = await api.delete(`/idols/${id}`);
  return res.data;
}
