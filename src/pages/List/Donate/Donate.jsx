import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useCredit from '@/stores/creditIndex';
import { apiCall } from '@/apis/baseApi';
import { putDonaCreadit } from '@/apis/donationsApi';
import numberFormat from '@/util/numberFormat';
import './Donate.scss';
import creditIcon from '@/assets/image/icons/ic_credit.svg';

const Donate = ({ donation, onDonateSuccess }) => {
  if (!donation) return null;

  const {
    id,
    idol,
    title,
    subtitle,
    receivedDonations,
    targetDonation,
    deadline,
  } = donation;

  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [inputCredit, setInputCredit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { credit, decreaseCredit } = useCredit(state => state);

  // 입력된 크레딧이 보유 크레딧을 초과하는지 확인
  const isOverHasCredit = inputCredit && Number(inputCredit) > credit;
  // 입력한 크레딧과 후원된 크레딧의 합이 타겟 크레딧을 초과하는지 확인
  const isOverTargetCredit =
    inputCredit && Number(inputCredit) + receivedDonations > targetDonation;
  // 입력할 수 있는 최대 크레딧
  const maxLimitCredit = targetDonation - receivedDonations;

  // 남은 날짜 계산
  const calculateRemainingDays = deadline => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 진행률 계산
  const calculateProgress = (received, target) => {
    return Math.min((received / target) * 100, 100);
  };

  const remainingDays = calculateRemainingDays(deadline);
  const progressPercent = calculateProgress(receivedDonations, targetDonation);

  // 후원하기 Modal Open & Close
  const handleDonateModal = () => {
    // 익명 인자로 이전의 값을 반대로 사용
    setIsDonateOpen(prev => !prev);
    setInputCredit('');
  };

  // 입력 값 변경 핸들러
  const handleInputChange = ({ target: { value } }) => {
    // 숫자만 입력 가능하도록
    if (value === '' || /^\d+$/.test(value)) {
      setInputCredit(value);
    }
  };

  // 후원하기 실행
  const handleDonate = async () => {
    // 이미 처리 중이면 중단
    if (isSubmitting) return;

    const creditAmount = Number(inputCredit);

    // 유효성 검사
    if (!inputCredit) {
      toast.error('크레딧이 입력되지 않았습니다.');
      return;
    }

    if (creditAmount <= 0) {
      toast.error('0 이상의 크레딧을 입력해주세요.');
      return;
    }

    // 크레딧 초과 시 실행하지 않음
    if (creditAmount > credit) return;

    setIsSubmitting(true); // 처리 시작

    try {
      const result = await apiCall(putDonaCreadit, id, creditAmount);

      if (!result) return;

      // API 호출 성공 시
      decreaseCredit(creditAmount); // 크레딧 차감
      handleDonateModal();
      onDonateSuccess();
    } catch (err) {
      toast.error('데이터 처리 중 오류가 발생했습니다. ');
      console.error(err);
    } finally {
      setIsSubmitting(false); // 처리 완료
    }
  };

  return (
    <>
      <div className="donateContainer">
        <div className="donateHeader">
          <div className="donateImgBox">
            <img src={idol.profilePicture} alt={`${idol.name} profile`} />
            <Button
              variant="donate"
              onClick={handleDonateModal}
              isDisabled={
                !remainingDays > 0 || receivedDonations === targetDonation
              }
            />
          </div>
        </div>
        <div className="donateInfo">
          <span className="donateInfoSubTitle">{subtitle}</span>
          <span className="donateInfoTitle">{title}</span>
        </div>
        <div className="donateFooter">
          <div className="donateCredit">
            <img src={creditIcon} alt="credit icon" />
            <div className="donateCreditBox">
              <span>{numberFormat(receivedDonations)}</span>
              <span>/</span>
              <span>{numberFormat(targetDonation)}</span>
            </div>
          </div>
          <span className="donateRemainingDays">
            {remainingDays > 0 ? `${remainingDays}일 남음` : '기한 만료'}
          </span>
        </div>
        <div
          className="donateProgress"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 후원하기 Modal */}
      <Modal
        variant="donate"
        title="후원하기"
        isOpen={isDonateOpen}
        onClose={handleDonateModal}
        onClick={handleDonate}
        disabled={isSubmitting}
      >
        <div className="donateModalInfo">
          <img src={idol.profilePicture} alt={`${idol.name} profile`} />
          <div className="donateModalInfoBox">
            <span className="subTitle">{subtitle}</span>
            <span className="title">{title}</span>
          </div>
        </div>
        <div className="donateModalCreditBox">
          <div
            className={`donateModalCreditInput ${isOverHasCredit || isOverTargetCredit ? 'overCredit' : ''}`}
          >
            <input
              type="text"
              placeholder="크레딧 입력"
              value={inputCredit}
              onChange={handleInputChange}
            />
            <img src={creditIcon} alt="credit icon" />
          </div>
          {isOverHasCredit && (
            <span>갖고 있는 크레딧보다 더 많이 후원할 수 없어요</span>
          )}
          {isOverTargetCredit && (
            <span>
              {numberFormat(maxLimitCredit)}보다 더 많이 후원할 수 없어요
            </span>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Donate;
