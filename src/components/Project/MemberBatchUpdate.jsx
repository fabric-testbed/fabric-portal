import Dropfile from "../common/Dropfile";
import React, { Component } from 'react'
import { toast } from "react-toastify";
import { getPeople } from "../../services/peopleService";

export default class MemberBatchUpdate extends Component {
  state = {
    memberStrsToAdd: [],
    memberIDsToAdd: []
  }

  handleFileDrop = (membersStr) => {
    try {
      const members = membersStr.split(/\r?\n/);
      this.setState({
        memberStrsToAdd: members
      });
    } catch (err) {
      toast.error("Failed to gather members' data from the CSV file. Please check if your file meets the format requirements.")
    }
    console.log(this.state.memberStrsToAdd)
  }

  handleSearchMembers = async () => {
    const memberIDsToAdd = [];
    for (const memberStr of this.state.memberStrsToAdd) {
      const email = memberStr.split(",")[1];
      try {
        const { data: res } = await getPeople(email);
        const memberToAdd = res.results[0];
        memberIDsToAdd.push(memberToAdd.uuid);
      }
      catch(err) {
        console.log(err)
      }
    }

    this.setState({ memberIDsToAdd });
    console.log(memberIDsToAdd)
  }
 
  render() {
    return (
      <div>
        <Dropfile
          onFileDrop={this.handleFileDrop}
          accept={{'text/csv': [".csv"]}}
          acceptFormat={"csv"}
          textStr={"Click to select or drag & drop the CSV file here."}
        />
        <button
          onClick={this.handleSearchMembers}
        >
          Upload
        </button>
      </div>
    )
  }
}