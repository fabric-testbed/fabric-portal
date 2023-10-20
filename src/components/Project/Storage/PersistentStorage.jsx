import React from "react";
import StorageCard from "./StorageCard";
import { toast } from "react-toastify";
import toLocaleTime from "../../../utils/toLocaleTime";
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
      parsedVolume.created_on = toLocaleTime(volume.created_on);
      parsedVolume.expires_on = toLocaleTime(volume.expires_on);
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