import React, { useState } from 'react';
import Tab from './Tab';

function Tabs({ children, activeTab: initialActiveTab }) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  return (
    <div className="tabs">
      <div className="tab-list">
        {children.map((child) => {
          const { label, badge, color } = child.props;
          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              badge={badge}
              color={color}
              onClick={setActiveTab}
            />
          );
        })}
      </div>
      <div className="tab-content">
        {children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
}

export default Tabs;
