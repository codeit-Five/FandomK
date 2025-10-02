import { useEffect, useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { apiCall } from './baseApi';

import ImageUpload from './imageApi';
import idolMock from './mock/idolMock';
import donaMock from './mock/donaMock';
import getCharts from './chartsApi';
import postVotes from './votesApi';
import { getIdols, postIdols, putIdols, deleteIdols } from './idolsApi';
import {
  getDonations,
  postDonations,
  putDonations,
  deleteDonations,
  putDonaCreadit,
} from './donationsApi';

function ApiTemplate() {
  const [apiData, setApiData] = useState([]);
  const didMountRef = useRef(false);
  console.log(apiData);

  async function loadApiData() {
    /* idol 호출 */
    const result = await apiCall(getIdols, null, 100, '');
    // const result = await apiCall(postIdols, idolMock[0]);
    // const result = await apiCall(putIdols, 6348, idolMock[0]);
    // const result = await apiCall(deleteIdols, 6352);
    // const result = await apiCall(deleteIdols, i);

    /* donations 호출 */
    // const result = await apiCall(getDonations, 10, null, [949, 955, 959]);
    // const result = await apiCall(postDonations, donaMock[i]);
    // const result = await apiCall(putDonations, 939, donaMock[1]);
    // const result = await apiCall(deleteDonations, 939);
    // const result = await apiCall(putDonaCreadit, 920, 1000);

    /* charts 호출 */
    // const result = await apiCall(getCharts, 'male');

    /* votes 호출 */
    // const result = await apiCall(postVotes, 5940);

    if (result) {
      setApiData(result); // 성공
    } else {
      setApiData([]); // 에러 처리 (토스트 등)
    }
  }
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !didMountRef.current) {
      didMountRef.current = true;
      return; // 첫 번째 실행은 여기서 종료 (POST 방지)
    }

    loadApiData();
  }, []);
  return (
    <div>
      <h1>Api Template</h1>
      <ImageUpload />
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default ApiTemplate;
