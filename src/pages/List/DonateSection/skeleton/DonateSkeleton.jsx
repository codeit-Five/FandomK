import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// 데스크톱 환경에 따른 데이터 요청 개수 정의
const DESKTOP_PAGE_SIZE = 4;

// 데스크톱/모바일 환경에 따른 Donate 컴포넌트의 너비 정의
const DESKTOP_DONATE_SIZE = 282;
const MOBILE_DONATE_SIZE = 158;

// 스켈레톤 색상 정의
const BASE_COLOR = '#333';
const HIGHLIGHT_COLOR = '#444';

// Donate 컴포넌트의 형태를 모방한 스켈레톤 컴포넌트 정의
const DonateSkeleton = ({ isMobile }) => {
  // 모바일/데스크톱 크기 반영
  const fullHeight = isMobile ? '303px' : '402px';
  const imageHeight = isMobile ? 206 : 293;

  return (
    <div
      className="donateSkeleton"
      style={{
        width: '100%',
        display: 'block',
        position: 'relative',
        height: fullHeight,
      }}
    >
      {/* 1. 이미지 영역: isMobile에 따라 높이 변경 */}
      <Skeleton
        height={imageHeight}
        borderRadius={8}
        style={{ marginBottom: '12px' }}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />

      {/* 2. 제목/부제목 영역 (텍스트 라인) */}
      <Skeleton
        width="50%"
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
        style={{ marginBottom: '8px' }}
      />
      <Skeleton
        width="60%"
        style={{ marginBottom: '24px' }}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />

      {/* 3. 크레딧/남은 일수 영역 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 크레딧 영역 (좌측) */}
        <Skeleton
          width="80px"
          height={12}
          baseColor={BASE_COLOR}
          highlightColor={HIGHLIGHT_COLOR}
        />

        {/* 남은 일수 영역 (우측) */}
        <Skeleton
          width="45px"
          height={12}
          baseColor={BASE_COLOR}
          highlightColor={HIGHLIGHT_COLOR}
        />
      </div>
    </div>
  );
};

export const DonateSkeletonList = ({ width, isMobile }) => {
  // 표시할 스켈레톤 컴포넌트의 갯수 확인
  const getSkeletonSize = () => {
    if (width < 525) return Math.round(width / MOBILE_DONATE_SIZE);
    if (width < 1200) return Math.round(width / DESKTOP_DONATE_SIZE);
    return DESKTOP_PAGE_SIZE;
  };

  const skeletonList = Array(getSkeletonSize())
    .fill(0)
    .map((_, index) => (
      <div className="donateContainer" key={`skeleton${index}`}>
        <DonateSkeleton isMobile={isMobile} />
      </div>
    ));

  // 데스크톱: 그룹으로 감싸기, 모바일: 그대로 반환
  return isMobile ? (
    skeletonList
  ) : (
    <div className="donateGroup" key="skeletonGroup">
      {skeletonList}
    </div>
  );
};

export const NextBtnSkeleton = () => {
  return (
    <div className="donateNavBtn">
      <Skeleton
        width={40}
        height={78.333}
        borderRadius={6.667}
        baseColor={BASE_COLOR}
        highlightColor={HIGHLIGHT_COLOR}
      />
    </div>
  );
};
