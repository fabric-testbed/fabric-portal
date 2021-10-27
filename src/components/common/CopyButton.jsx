import React, { Component } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class CopyButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      copied: false,
    };
    this.makeTimer();
  }
  

  renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );

  makeTimer(){
    setInterval(() => {
      this.setState( { copied: false })
    }, 3000)
  }

  render() {
    const { id, text } = this.props;
    return (
      <OverlayTrigger
        show={this.state.copied}
        placement="right"
        delay={{ show: 100, hide: 300 }}
        overlay={this.renderTooltip(
          `copy-success-${id}`,
          `Copied: ${id}`
        )}
      >
        <CopyToClipboard
          text={id}
          onCopy={() => this.setState({copied: true})}
        >
          <button className="btn btn-sm btn-primary">
            <i class="fa fa-copy"></i> { text }
          </button>
        </CopyToClipboard>
      </OverlayTrigger>
    )
  }
}

export default CopyButton;