import React from "react";
import { getActiveFacilityUpdates } from "../../services/announcementService";
import FacilityUpdateCard from "./FacilityUpdateCard";
import SpinnerWithText from "../common/SpinnerWithText";
import { toast } from "react-toastify";

class FacilityUpdates extends React.Component {
  state = {
    showSpinner: true,
    updates: [],
  };

  async componentDidMount() {
    try {
      const { data } = await getActiveFacilityUpdates();
      let updates = data.results;
      updates = updates.map(update => {
        const long_date = update.display_date
        update.display_date = long_date.substring(0, 10);
        return update;
      })

      this.setState({ updates });
      this.setState({ showKeySpinner: false });
    } catch (ex) {
      toast.error("Failed to load facility updates. Please reload this page.");
      console.log("Failed to load facility updates: " + ex.response.data);
    }
  }

 
  render() {
    const { updates, showSpinner } = this.state;
    return (
      <div>
        {
          showSpinner ? <SpinnerWithText text={"Loading updates..."} /> : 
          <FacilityUpdateCard updates={updates} />
        }
      </div>
    );
  }
}

export default FacilityUpdates;
