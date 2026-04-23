import React from 'react';

export default function SliverKeyMultiSelect({ keys, selectedKeyIDs, onKeyCheck }) {
  return (
    <div className="mt-2">
      {keys.map(key => (
        <div className="form-check mb-2 me-3" key={`sliver-key-${key.uuid}`}>
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
      ))}
    </div>
  );
}
