import api from './baseApi';

// 후원 조회
export async function getDonations(pageSize, priorityIdolIds, cursor) {
  const res = await api.get('/donations', {
    params: { pageSize, priorityIdolIds, cursor },
  });
  return res.data;
}

// 후원 추가
export async function postDonations(data) {
  const res = await api.post('/donations', data);
  return res.data;
}

// 후원 수정
export async function putDonations(id, data) {
  const res = await api.put(`/donations/${id}`, data);
  return res.data;
}

// 후원 삭제
export async function deleteDonations(id) {
  const res = await api.delete(`/donations/${id}`);
  return res.data;
}

// 후원 크레딧 수정
export async function putDonaCreadit(id, amount) {
  const res = await api.put(`/donations/${id}/contribute`, { amount });
  return res.data;
}
