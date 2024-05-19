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

export default function Wysiwyg({ name, label, error, disabled, tooltip, ...rest }) {
  const [value, setValue] = useState(value);

  function onChange(e) {
    setValue(e.target.value);
  }

  return (
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
  );
}