import React, { Component } from 'react';

export default class SliverKeyMultiSelect extends Component { 
  render() {
    const { keys, selectedKeyIDs, onKeyCheck } = this.props;
    return(
      <div className="mt-2">
        {
          keys.map(key =>
          <div className="form-check mb-2 mr-3" key={`sliver-key-${key.uuid}`}>
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id={key.uuid}
              defaultChecked={selectedKeyIDs.includes(key.uuid)}
              onClick={() => onKeyCheck(key.uuid)}
            />
            <label className="form-check-label">
              {key.comment}
            </label>
          </div>
          )
        }
      </div>
    )
  }
}