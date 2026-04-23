import React from 'react';

const MatchBadge = ({ percentage }) => {
  if (!percentage && percentage !== 0) return null;

  const cls = percentage >= 70 ? 'match-high' : percentage >= 40 ? 'match-mid' : 'match-low';
  const icon = percentage >= 70 ? '🟢' : percentage >= 40 ? '🟡' : '🔴';

  return (
    <span className={`match-badge ${cls}`}>
      {icon} {percentage}% match
    </span>
  );
};

export default MatchBadge;
