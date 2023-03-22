import { text } from '@fortawesome/fontawesome-svg-core';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
// import { parse } from 'csv';

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
        console.log("csv")
        const reader = new FileReader();
        // const parser = parse();
        reader.readAsText(file);
        console.log(reader)
        reader.onload = () => {
          // parser.on('readable', function(){
          //   let data; while((data = parser.read()) !== null){
          //     console.log(data)
          //   }
          // });
          const textStr = reader.result
          // onFileDrop(textStr)
          console.log(textStr)
        };
      }
    })
  }, [])

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