import React from "react";
import { useState } from 'react';
import { 
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnUnderline,
  HtmlButton,
  Toolbar,
  Editor,
  EditorProvider
} from 'react-simple-wysiwyg';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
);

export default function Wysiwyg({ name, content, label, error, disabled, tooltip, ...rest }) {
  const [value, setValue] = useState(content);

  React.useEffect(() => {
    setValue(content);
}, [content])

  function onChange(e) {
    setValue(e.target.value);
  }

  return (
    <div className="form-group">
      {
        tooltip ? <label htmlFor={name}>
          {label} 
          <OverlayTrigger
            placement="right"
            delay={{ show: 100, hide: 300 }}
            overlay={renderTooltip("select-tooltip", tooltip)}
          >
            <i className="fa fa-question-circle text-secondary ml-2"></i>
          </OverlayTrigger>
        </label> :
        <label htmlFor={name}>{label}</label>
      }
      <EditorProvider>
        <Editor value={value} onChange={onChange}>
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnNumberedList />
            <BtnBulletList />
            <BtnLink />
            <HtmlButton />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}