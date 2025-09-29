import { useState } from 'react';
import btnClose from '../../assets/image/icons/ic_btn_close.svg';
import './Modal.scss';

export default function Modal({
  children,
  modalClassName,
  title,
  bottomBtn,
  isBottomBtnDisabled,
  isHasBottomContent,
  triggerBtn,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {triggerBtn && (
        <button
          className={`${
            modalClassName === 'CreditRecharge' ? 'txtStyle7' : 'txtStyle12'
          } modalTriggerBtn${modalClassName}`}
          onClick={openModal}
        >
          {triggerBtn}
        </button>
      )}

      {isOpen && (
        <div className="modalContainer">
          <div className={`modalBox${modalClassName}`}>
            {/* 헤더 */}
            <div className="modalHeader">
              {title && <div className="txtStyle5 modalTitle">{title}</div>}
              <button className="modalCloseBtn" onClick={closeModal}>
                <img src={btnClose} alt="Button Close" />
              </button>
            </div>

            {/* 내용 */}
            <div className="modalContentBox">{children}</div>

            {/* 하단 버튼 */}
            <button
              className="txtStyle11 modalBottomBtn"
              disabled={isBottomBtnDisabled}
            >
              {bottomBtn}
            </button>

            {/* 하단 버튼 아래 표시 */}
            {isHasBottomContent && (
              <div className="txtStyle14 modalBottomContent">
                투표하는 데 <span>1000 크레딧</span>이 소모됩니다.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
