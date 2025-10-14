/**
 * 숫자를 받아 천 단위 콤마가 포함된 문자열로 포맷팅하는 훅
 *
 * @param {number} number - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
const numberFormat = number => {
  if (typeof number !== 'number') {
    return String(number); // 숫자가 아니면 그대로 반환
  }

  // toLocaleString()으로 포맷팅 처리
  return number.toLocaleString('ko-KR');
};

export default numberFormat;
