import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

export default function DropFile() {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.readAsText(file)
      reader.onload = () => {
        // Do whatever you want with the file contents
        const textStr = reader.result

        console.log(textStr)
      }
    })
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="pl-2 cursor-pointer">
        <i className="fa fa-cloud-upload mx-2" />
        Click to select or drag &amp; drop your slice topology JSON file here.
      </p>
    </div>
  )
}
