import api from './baseApi';

// 조회
export async function getIdols(pageSize) {
  const res = await api.get('/idols', {
    params: { pageSize },
  });
  return res.data;
}

// 생성
export async function postIdols(data) {
  const res = await api.post('/idols', data);
  return res.data;
}

// 수정
export async function putIdols(id, data) {
  const res = await api.put(`/idols/${id}`, data);
  return res.data;
}

// 삭제
export async function deleteIdols(id) {
  const res = await api.delete(`/idols/${id}`);
  return res.data;
}
