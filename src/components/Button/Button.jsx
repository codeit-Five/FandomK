import './Button.scss';
import btnCredit from '../../assets/image/icons/ic_btn_credit.svg';
import btnChart from '../../assets/image/icons/ic_btn_chart.svg';
import btnPlus from '../../assets/image/icons/ic_btn_plus.svg';

const BUTTON_CONTENT = {
  start: '지금 시작하기',
  donate: '후원하기',
  voteChart: (
    <>
      <img src={btnChart} alt="Button Chart" /> <span>차트 투표하기</span>
    </>
  ),
  recharge: (
    <>
      <img src={btnCredit} alt="Button Chart" /> <span>충전하기</span>
    </>
  ),
  vote: '투표하기',
  voteDisabled: '이미 차트에 투표했어요',
  confirm: '확인',
  add: (
    <>
      <img src={btnPlus} alt="Button Chart" /> <span>추가하기</span>
    </>
  ),
};

export default function Button({
  variant,
  isModal = false,
  isDisabled = false,
  onClick,
}) {
  const variantClass = `btn${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;

  const contentKey =
    isDisabled && variant === 'vote' ? 'voteDisabled' : variant;

  return (
    <button
      className={`${variantClass} ${isModal ? 'modal' : ''}`.trim()}
      disabled={isDisabled}
      onClick={onClick}
    >
      {BUTTON_CONTENT[contentKey]}
    </button>
  );
}
