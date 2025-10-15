import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import btnClose from '@/assets/image/icons/ic_btn_close.svg';
import btnPrev from '@/assets/image/icons/ic_btn_prev.svg';
import useWindowSize from '@/hooks/useWindowSize';
import useModalLock from '@/hooks/useModalLock';
import './Modal.scss';
import Button from '../Button/Button';

export default function Modal({
  children,
  variant,
  title,
  onClick,
  isDisabled,
  isHasBottomContent,
  isOpen,
  onClose,
}) {
  const variantClass = `modal${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;

  // mobile 화면 체크 (투표모달창)
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (width < 525) return setIsMobile(true);
    return setIsMobile(false);
  }, [width]);

  // 배경 클릭시 팝업 close
  const modalRef = useRef();
  const handleModalOverlay = e => {
    if (e.target === modalRef.current) onClose();
  };

  // 배경 스크롤 방지
  useModalLock(isOpen);

  const modalContent = (
    <div className="modalOverlay" ref={modalRef} onClick={handleModalOverlay}>
      <div className={variantClass}>
        {/* 헤더 영역 */}
        <div className="modalHeader">
          {title && <div className="modalTitle">{title}</div>}
          <button className="modalCloseBtn" onClick={onClose}>
            <img
              src={variant === 'vote' && isMobile ? btnPrev : btnClose}
              alt="Button Close"
            />
          </button>
        </div>

        {/* 내용 */}
        <div className="modalContent">{children}</div>

        <div className="modalFooter">
          {/* 하단 버튼 */}
          <Button
            variant={variant}
            isModal={variant === 'donate'}
            disabled={isDisabled}
            onClick={onClick}
          />

          {/* 하단 버튼 아래 표시 */}
          {isHasBottomContent && (
            <div className="modalBottomContent">
              투표하는 데 <span>1000 크레딧</span>이 소모됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Portal을 사용하여 modalRoot에 렌더링
  if (!isOpen) return null;

  const modalRoot = document.getElementById('modalRoot');
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
}
