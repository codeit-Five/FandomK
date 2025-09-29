import api from './baseApi';

// 조회
export default async function getCharts(gender, cursor, pageSize) {
  const res = await api.get('/charts/{gender}', {
    params: { gender, cursor, pageSize },
  });
  return res.data;
}
