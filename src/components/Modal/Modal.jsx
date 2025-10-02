import btnClose from '../../assets/image/icons/ic_btn_close.svg';
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

  return (
    isOpen && (
      <div className="modalOverlay">
        <div className={variantClass}>
          {/* 헤더 영역 */}
          <div className="modalHeader">
            {title && <div className="modalTitle">{title}</div>}
            <button className="modalCloseBtn" onClick={onClose}>
              <img src={btnClose} alt="Button Close" />
            </button>
          </div>

          {/* 내용 */}
          <div className="modalContent">{children}</div>

          <div className="modalFooter">
            {/* 하단 버튼 */}
            <Button
              variant={variant}
              isModal={variant === 'donate' ? true : undefined}
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
    )
  );
}
