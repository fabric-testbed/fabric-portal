import React from "react";
import { getActiveFacilityUpdates } from "../../services/announcementService";
import FacilityUpdateCard from "./FacilityUpdateCard";
import SpinnerWithText from "../../common/SpinnerWithText";
import { toast } from "react-toastify";

class FacilityUpdates extends React.Component {
  state = {
    showSpinner: true,
    updates: [],
  };

  async componentDidMount() {
    try {
      const { data } = await getActiveFacilityUpdates();
      const updates = data.results;
      this.setState({ updates });
      this.setState({ showKeySpinner: false });
    } catch (ex) {
      toast.error("Failed to load facility updates. Please reload this page.");
      console.log("Failed to load facility updates: " + ex.response.data);
    }
  }

 
  render() {
    const { updates, showSpinner } = this.state.updates;
    return (
      <div>
        {
          showSpinner ? <SpinnerWithText text={"Loading updates..."} /> : 
          <FacilityUpdateCard header={"Facility Updates"} data={updates} />
        }
      </div>
    );
  }
}

export default FacilityUpdates;
