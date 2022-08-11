import React from "react";
import { getActiveFacilityUpdates } from "../../services/announcementService";
import FacilityUpdateCard from "./FacilityUpdateCard";
import { toast } from "react-toastify";

class FacilityUpdates extends React.Component {
  state = {
    showSpinner: false,
    updates: [],
  };

  async componentDidMount() {
    this.setState({ showSpinner: true });

    try {
      const { data: res } = await getActiveFacilityUpdates();
      let updates = res.results;
      updates = updates.map(update => {
        const long_date = update.display_date
        update.display_date = long_date.substring(0, 10);
        return update;
      })
      this.setState({ updates, showSpinner: false });
    } catch (ex) {
      toast.error("Failed to load facility updates. Please reload this page.");
      console.log("Failed to load facility updates: " + ex.response.data);
    }
  }

  render() {
    const { updates, showSpinner } = this.state;
    return (
      <div>
        <FacilityUpdateCard showSpinner={showSpinner} updates={updates} />
      </div>
    );
  }
}

export default FacilityUpdates;
