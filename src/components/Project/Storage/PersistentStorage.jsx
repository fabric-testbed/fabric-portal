import React from "react";
import StorageCard from "./StorageCard";
import { getPeopleById } from "../../../services/peopleService";
import { toast } from "react-toastify";
import toLocaleTime from "../../../utils/toLocaleTime";

class PersistentStorage extends React.Component {
 async getUserNameByID(uuid) {
    try {
      const { data: res } = await getPeopleById(uuid);
      const user = res.results[0];
      return user.name;
    } catch (err) {
      toast.error("Failed to get the requester's name.");
      return "unknown name";
    }
  }

  parseVolumeData() {
      // parse date to local time
      // parse requested user id to user name
      const { volumes } = this.props;
      
      let parsed_volumes = volumes.map((v) => {
        v.created_on = toLocaleTime(v.created_on);
        v.expires_on = toLocaleTime(v.expires_on);
        v.requested_by_name = this.getUserNameByID(v.requested_by_uuid);
        return v;
      });

      return parsed_volumes;
    };

  render() {
    const { parsed_volumes: volumes } = this.parseVolumeData();

    return (
      <div id="persistentStorage">
        <h1 className="mb-3">Persistent Storage</h1>
        <div className="row text-sm-size">
          {
            volumes && volumes.length > 0 && volumes.map((volume, index) => {
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
          {
            volumes && volumes.length === 0 && <div>
              No persistent storage for this project.
            </div>
          }
        </div>
      </div>
    );
  }
}

export default PersistentStorage;