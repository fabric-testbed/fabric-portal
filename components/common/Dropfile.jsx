import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

const DropFile = props => {
  const { onFileDrop, acceptFormat, accept, textStr } = props;

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (acceptFormat === "json") {
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.readAsText(file)
        reader.onload = () => {
          // Do whatever you want with the file contents
          const textStr = reader.result
          onFileDrop(textStr)
        }
      } else if (acceptFormat === "csv") {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const textStr = reader.result
          onFileDrop(textStr)
        };
      }
    })
  }, [acceptFormat, onFileDrop]);

  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: accept})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="pl-2 cursor-pointer">
        <i className="fa fa-cloud-upload mx-2" />
        { textStr }
      </p>
    </div>
  )
}


export default DropFile;