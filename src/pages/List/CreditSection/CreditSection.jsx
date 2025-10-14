import { useState } from 'react';
import useCredit from '@/stores/creditIndex';
import numberFormat from '@/util/numberFormat';
import useCountAnimation from '@/hooks/useCountAnimation';
import Modal from '@/components/Modal/Modal';
import OptionCard from '@/components/OptionCard/OptionCard';
import './CreditSection.scss';
import creditIcon from '@/assets/image/icons/ic_credit.svg';

const RECHARGE_CREDIT = [100, 500, 1000];

const CreditSection = () => {
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const { credit, increaseCredit } = useCredit(state => state);
  const [selectedCredit, setSelectedCredit] = useState(0);

  const animatedCredit = useCountAnimation(credit);
  const formattedCredit = numberFormat(animatedCredit);

  // 크레딧 충전하기 Modal Open
  const handleOpenModal = () => {
    setIsRechargeOpen(true);
  };

  // 크레딧 충전하기 Modal close
  const handleCloseModal = () => {
    setIsRechargeOpen(false);
    setSelectedCredit(0);
  };

  // 크레딧 충전하기
  const handleRechargeCredit = () => {
    increaseCredit(selectedCredit);
    handleCloseModal();
  };

  return (
    <>
      <section className="creditSection">
        <div className="creditContainer">
          <div className="creditBox">
            <h2 className="creditBoxTitle">내 크레딧</h2>
            <div className="creditAmount">
              <img src={creditIcon} alt="credit icon" />
              <span>{formattedCredit} </span>
            </div>
          </div>
          <button className="creditChargeBtn" onClick={handleOpenModal}>
            충전하기
          </button>
        </div>
      </section>

      {/* 크레딧 충전하기 Modal */}
      <Modal
        variant="recharge"
        title="크레딧 충전하기"
        isOpen={isRechargeOpen}
        onClose={handleCloseModal}
        onClick={handleRechargeCredit}
      >
        {RECHARGE_CREDIT.map(item => (
          <OptionCard
            key={item}
            variant="recharge"
            isRadioDisplay
            radioInfo={{
              id: item,
              name: 'creditOption',
              selected: selectedCredit,
              setSelected: setSelectedCredit,
            }}
            creditValue={item}
          />
        ))}
      </Modal>
    </>
  );
};

export default CreditSection;
