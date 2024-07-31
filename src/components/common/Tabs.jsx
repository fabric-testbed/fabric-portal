import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import { useParams, useNavigate, useLocation } from "react-router-dom";

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

  onClickTabItem = (tab) => {
    const tabMapping={
      "Testbed Resources": "#resources",
      "Measuring and Monitoring Tools": "#tools",
    }
    this.setState({ activeTab: tab });
    this.props.navigate(`/resources${tabMapping[tab]}`);
  }

  render() {
    const {
      onClickTabItem,
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
                onClick={onClickTabItem}
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