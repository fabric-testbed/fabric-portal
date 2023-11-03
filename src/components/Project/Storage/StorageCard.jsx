import React from "react";
import { Link } from "react-router-dom";
import { getPeopleById } from "../../../services/peopleService";
import { toast } from "react-toastify";

class StorageCard extends React.Component {
  state = {
    userName: ""
  }
  
  async componentDidMount() {
    const { data } = this.props;

    try {
      const { data: res } = await getPeopleById(data.requested_by_uuid);
      const user = res.results[0];
      this.setState({ userName: user.name });
    } catch (err) {
      toast.error("Failed to get the requester's name.");
    }
  }

  parseSites = (sites) => {
    let sitesStr = sites[0];
    for (const site of sites.slice(1)) {
      sitesStr += ` ,${site}`;
    }
    return sitesStr;
  }

  render() {
    const { data } = this.props;
    const { userName } = this.state;

    return (
      <div className="persistent-storage-card">
        <div className="mb-2"><b>Name</b>: {data.volume_name ? data.volume_name : "Unknown"}</div>
        <div className="mb-2"><b>Size</b>: {data.volume_size_gb ? data.volume_size_gb : 0} GB</div>
        <div className="mb-2"><b>Sites</b>: {data.site_list ? this.parseSites(data.site_list) : "Unknown"}</div>
        <div className="mb-2"><b>Create Date</b>: {data.created_on ? data.created_on : "Unknown"}</div>
        <div className="mb-2"><b>Expiration Date</b>: {data.expires_on ? data.expires_on : "Unknown"}</div>
        <div className="mb-2">
          <b>
            <span className="mr-2">Requested By:</span>
            {
              data.requested_by_uuid && userName ?  
              <Link to={`/users/${data.requested_by_uuid}`}>
                {userName}
              </Link> 
              :
              "Unknown"
            }
          </b>
        </div>
        <div className="mb-2"><b>UUID</b>: {data.uuid ? data.uuid : "Unknown"}</div>
      </div>
    );
  };
}

export default StorageCard;