import Dropfile from "../common/Dropfile";
import React, { Component } from 'react'
import { toast } from "react-toastify";

export default class MemberBatchUpdate extends Component {
  state = {

  }

  handleFileDrop = (membersStr) => {
    // similar to use draft
    const membersJSON = JSON.parse(membersStr);
    console.log(membersJSON)
    try {
      this.setState({ 

      });
    } catch (err) {
      toast.error("Failed to gather members' data from the CSV file. Please check if your file meets the format requirements.")
    }
  }

  render() {
    return (
      <Dropfile
      onFileDrop={this.handleFileDrop}
      accept={{'text/csv': [".csv"]}}
      acceptFormat={"csv"}
      textStr={"Click to select or drag & drop the CSV file here."}
   />
    )
  }
}