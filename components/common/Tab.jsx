import React from 'react';

function Tab({ activeTab, label, badge, color, onClick }) {
  const handleClick = () => {
    onClick(label);
  };

  let className = 'tab-list-item';
  if (activeTab === label) {
    className += ' tab-list-active';
  }

  return (
    <div className={className} onClick={handleClick}>
      <div className="d-flex">
        <span>{label}</span>
        {badge != null && <span className={`badge bg-${color} ms-2 align-self-center`}>{badge}</span>}
      </div>
    </div>
  );
}

export default Tab;
