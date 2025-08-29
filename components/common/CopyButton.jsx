import React, { Component } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class CopyButton extends Component {
  state = {
    copied: false,
  }

  renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );

  render() {
    const { id, text, btnStyle, showCopiedValue } = this.props;
    const overlayText = showCopiedValue ? `Copied: ${id}` : `Copied!`
    return (
      <OverlayTrigger
        show={this.state.copied}
        placement="right"
        delay={{ show: 100, hide: 300 }}
        overlay={this.renderTooltip(
          `copy-success-${id}`,
          overlayText
        )}
      >
        <CopyToClipboard
          text={id}
          onCopy={() => this.setState({ copied: true })}
        >
          <button
            className={`btn btn-sm btn-${btnStyle}`}
            onMouseLeave={() => this.setState({ copied: false })}
            onClick={e => e.preventDefault()}
          >
            <i className="fa fa-copy"></i> { text }
          </button>
        </CopyToClipboard>
      </OverlayTrigger>
    )
  }
}

export default CopyButton;