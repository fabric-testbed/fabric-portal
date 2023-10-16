import React from "react";
import StorageCard from "./StorageCard";
import { getStorage } from "../../../services/storageService";
import { getPeopleById } from "../../../services/peopleService";
import { toast } from "react-toastify";
import toLocaleTime from "../../../utils/toLocaleTime";

class PersistentStorage extends React.Component {
  state = {
    volumes: []
  };

  async componentDidMount() {
    try {
      const { data } = await getStorage(this.props.projectId, 0, 100);
      const volumes = data.results;
      this.setState({ volumes });
    } catch (err) {
      toast.error("Failed to load volumes. Please reload this page.");
    }
  }

  getUserNameByID = async (uuid) => {
    try {
      const { data: res } = await getPeopleById(uuid);
      const user = res.results[0];
      return user.name;
    } catch (err) {
      toast.error("Failed to get the requester's name.");
      return "anonymous";
    }
  }

  parseVolumeData = () => {
      // parse date to local time
      // parse requested user id to user name
      const { volumes } = this.state.volumes;
      
      let parsed_volumes = volumes.map((v) => {
        v.created_on = toLocaleTime(v.created_on);
        v.expires_on = toLocaleTime(v.expires_on);
        v.requested_by_name = getPeopleById(v.requested_by_uuid);
        return v;
      });

      return parsed_volumes;
    };

  render() {
    const { parsed_volumes: volumes } = this.parseVolumeData();

    return (
      <div className="col-9" id="persistentStorage">
          <div className="row text-sm-size">
            {
              volumes.map((volume, index) => {
                return (
                  index % 2 === 0 ? (
                    <div className="col" key={`storage-card-${index}`}>
                      <StorageCard
                        data={volume}
                      />
                    </div>
                  ): (
                    <div className="col" key={`storage-card-${index}`}>
                      <StorageCard
                        data={volume}
                      />
                      <div className="w-100"></div>
                    </div>
                  )
                )
              })
            }
          </div>
      </div>
    );
  }
}

export default PersistentStorage;