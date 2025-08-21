import React from 'react';

export default function Skeleton() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-line" style={{ width: '80%' }}></div>
      <div className="skeleton-line" style={{ width: '80%' }}></div>
      <div className="skeleton-line" style={{ width: '80%' }}></div>
    </div>
  );
}
