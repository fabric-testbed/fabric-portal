import React from "react";
import StorageCard from "./StorageCard";
import { toast } from "react-toastify";
import { getStorage } from "../../../services/storageService";

class PersistentStorage extends React.Component {
  state = {
    volumes: []
  }

  parseVolumes = (volumes) => {
    const parsedVolumes = [];
    // parse date to local time
    // parse requested user id to user name
    for(const volume of volumes) {
      const parsedVolume = { ...volume };
      parsedVolume.created_on = volume.created_on.substring(0, 10);
      parsedVolume.expires_on = volume.expires_on.substring(0, 10);
      parsedVolumes.push(parsedVolume);
    }

    return parsedVolumes;
  }

  async componentDidMount() {
    try {
      const projectId = this.props.projectId;
      const { data: res } = await getStorage(projectId, 0, 100);
      this.setState({ volumes: this.parseVolumes(res.results) });
    } catch (err) {
      toast.error("Failed to load persistent storage.")
    }
  }

  render() {
    const { volumes } = this.state;

    return (
      <div id="persistentStorage">
        <h4 className="mb-3">Persistent Storage</h4>
        {
          volumes && volumes.length === 0 && 
          <div className="alert alert-primary" role="alert">
            No persistent storage volumes allocated for this project. Project Owners can request storage 
            by clicking the <b>Request Storage</b> button next to the project name.
          </div>
        }
        <div className="row text-sm-size">
        {
          volumes && volumes.length > 0 && volumes.map((volume, index) => {
            return (
                index % 2 === 0 ? (
                  <div className="col-6" key={`storage-card-${index}`}>
                    <StorageCard
                      data={volume}
                    />
                  </div>
                ): (
                  <div className="col-6" key={`storage-card-${index}`}>
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