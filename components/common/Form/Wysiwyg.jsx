import React from "react";
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
import { HelpCircle } from "lucide-react";

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
);

export default function Wysiwyg({ name, content, label, error, disabled, tooltip, onChange, ...rest }) {
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
            <HelpCircle className="mx-2 text-secondary" size={16} />
          </OverlayTrigger>
        </label> :
        <label htmlFor={name}>{label}</label>
      }
      <EditorProvider>
        <Editor value={content} onChange={onChange} {...rest} id={name} name={name}>
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