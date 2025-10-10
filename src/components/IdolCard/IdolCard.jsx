import './IdolCard.scss';
import btnPlus from '../../assets/image/icons/ic_btn_remove.svg';
import checkmark from '../../assets/image/icons/ic_checkmark.svg';

export default function IdolCard({
  variant,
  imgUrl,
  rankInfo,
  profileInfo,
  isModal,
  isSelected,
  isShowBtn,
  onClick,
  onRemove,
}) {
  const { rank, voteCount } = rankInfo || {};
  const { groupName, idolName } = profileInfo || {};
  const variantClass = `idolCard${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;

  const profileContent = (
    <>
      <div className="idolCardImgContainer">
        <div className="idolCardImgBox">
          <img src={imgUrl} alt="Idol Profile Img" />
          {isSelected && (
            <div className="idolCardSelected">
              <img src={checkmark} alt="idol profile checked" />
            </div>
          )}
        </div>
        {isShowBtn && (
          <button onClick={onRemove}>
            <img src={btnPlus} alt="btn idol remove" />
          </button>
        )}
      </div>
      {rank && <div className="rank">{rank}</div>}
      <div className="idolCardProfile">
        {variant === 'chart' ? (
          <>
            <div className="profileBox">
              <div className="groupName">{groupName}</div>
              <div className="idolName">{idolName}</div>
            </div>
            {isModal && <div className="voteCount">{voteCount}표</div>}
          </>
        ) : (
          <>
            <div className="idolName">{idolName}</div>
            <div className="groupName">{groupName}</div>
          </>
        )}
      </div>
      {voteCount !== undefined && !isModal && (
        <div className="voteCount">{voteCount}표</div>
      )}
    </>
  );

  return onClick ? (
    <button className={variantClass} onClick={onClick}>
      {profileContent}
    </button>
  ) : (
    <div className={`${variantClass} ${isModal ? 'modal' : ''}`.trim()}>
      {profileContent}
    </div>
  );
}
