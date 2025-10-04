import IdolCard from '../IdolCard/IdolCard';
import creditIcon from '../../assets/image/icons/ic_credit.svg';
import './OptionCard.scss';

export default function OptionCard({
  variant,
  isRadioDisplay,
  radioInfo,
  creditValue,
  idolCardInfo,
}) {
  const { id, name, selected, setSelected } = radioInfo || {};
  const { imgUrl, rankInfo, profileInfo } = idolCardInfo || {};

  const variantClass = `optionCard${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;
  const radioId = `radio${id}`;
  const isSelected = selected === id;

  return (
    <label
      htmlFor={isRadioDisplay ? radioId : undefined}
      className={`${variantClass} ${isSelected && variant === 'recharge' ? 'selected' : ''}`.trim()}
    >
      {variant === 'recharge' && (
        <div className="creditBox">
          <img src={creditIcon} alt="Credit Icon" />
          <span>{creditValue}</span>
        </div>
      )}

      {variant === 'chart' && (
        <IdolCard
          variant={variant}
          imgUrl={imgUrl}
          rankInfo={rankInfo}
          profileInfo={profileInfo}
          isModal
          isSelected={isSelected}
        />
      )}

      {isRadioDisplay && (
        <input
          type="radio"
          id={radioId}
          name={name}
          value={id}
          checked={selected === id}
          onChange={() => setSelected(id)}
        />
      )}
    </label>
  );
}
