import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };

  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  }

  render() {
    const {
      onClick,
      props: {
        activeTab,
        label,
        badge,
        color
      },
    } = this;

    let className = 'tab-list-item';

    if (activeTab === label) {
      className += ' tab-list-active';
    }

    return (
      <div
        className={`${className}`}
        onClick={onClick}
      >
        <div className="d-flex">
          <span>{label}</span>
          {
            badge && <span className={`badge badge-${color} ml-2 align-self-center`}>{badge}</span>
          }
        </div>
      </div>
    );
  }
}

export default Tab;