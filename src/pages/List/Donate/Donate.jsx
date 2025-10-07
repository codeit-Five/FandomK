import { useState } from 'react';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import './Donate.scss';
import creditIcon from '../../../assets/image/icons/ic_credit.svg';

const Donate = ({ donation }) => {
  if (!donation) return null;

  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const { idol, title, subtitle, receivedDonations, targetDonation, deadline } =
    donation;

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

  // 후원하기 Modal Open
  const handleOpenModal = () => {
    setIsDonateOpen(true);
  };

  // 후원하기 Modal close
  const handleCloseModal = () => {
    setIsDonateOpen(false);
  };

  return (
    <>
      <div className="donateContainer">
        <div className="donateHeader">
          <div className="donateImgBox">
            <img src={idol.profilePicture} alt={`${idol.name} profile`} />
            <Button variant="donate" onClick={handleOpenModal} />
          </div>
        </div>
        <div className="donateInfo">
          <span className="donateInfoSubTitle">{subtitle}</span>
          <span className="donateInfoTitle">{title}</span>
        </div>
        <div className="donateFooter">
          <div className="donateCredit">
            <img src={creditIcon} alt="credit icon" />
            <span>{receivedDonations.toLocaleString()}</span>
          </div>
          <span className="donateRemainingDays">{remainingDays}일 남음</span>
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
        onClose={handleCloseModal}
        style={{ height: '509px' }}
      >
        <div className="donateModalInfo">
          <img src={idol.profilePicture} alt={`${idol.name} profile`} />
          <div className="donateModalInfoBox">
            <span className="subTitle">{subtitle}</span>
            <span className="title">{title}</span>
          </div>
        </div>
        <div className="donateModalCreditBox">
          <div className="donateModalCreditInput">
            <input type="text" placeholder="크레딧 입력" />
            <img src={creditIcon} alt="credit icon" />
          </div>
          <span>갖고 있는 크레딧보다 더 많이 후원할 수 없어요</span>
        </div>
      </Modal>
    </>
  );
};

export default Donate;
