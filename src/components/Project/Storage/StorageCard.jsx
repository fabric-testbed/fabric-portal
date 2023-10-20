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

  render() {
    const { data } = this.props;
    const { userName } = this.state;

    return (
      <div className="card border-primary mr-1 mb-4 key-card">
        <div className="card-body">
          <div className="mb-2"><b>Name</b>: {data.volume_name ? data.volume_name : "Unknown"}</div>
          <div className="mb-2"><b>Size</b>: {data.volume_size_gb ? data.volume_size_gb : 0}</div>
          <div className="mb-2"><b>Sites</b>: {data.site_list ? data.site_list : "Unknown"}</div>
          <div className="mb-2"><b>Created</b>: {data.created_on ? data.created_on : "Unknown"}</div>
          <div className="mb-2"><b>Expiration</b>: {data.expires_on ? data.expires_on : "Unknown"}</div>
          <div className="mb-2">
            <b>Requested By</b>:
            {
              data.requested_by_uuid && data.requested_by_name ?  
              <Link to={`/users/${data.requested_by_uuid}`}>
                {userName}
              </Link> 
              :
              "Unknown"
            }
          </div>
          <div className="mb-2"><b>UUID</b>: {data.uuid ? data.uuid : "Unknown"}</div>
        </div>
      </div>
    );
  };
}

export default StorageCard;