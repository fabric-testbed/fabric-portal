import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.activeTab,
    };
  }


  render() {
    const {
      props: {
        children,
      },
      state: {
        activeTab,
      }
    } = this;

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
}

export default Tabs;