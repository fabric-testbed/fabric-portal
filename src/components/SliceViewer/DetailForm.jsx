import React, { Component } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyButton from "../common/CopyButton";
import { default as portalData } from "../../services/portalData.json";

export default class DetailForm extends Component {
  sshCommand = (managementIp, imageRef) => {
    const usernameOnImageMapping = {
      "default_centos8_stream": "centos",
      "default_centos9_stream": "centos",
      "default_centos_7": "centos",
      "default_centos_8": "centos",
      "default_debian_10": "debian",
      "default_fedora_35": "fedora",
      "default_rocky_8": "rocky",
      "default_ubuntu_18": "ubuntu",
      "default_ubuntu_20": "ubuntu",
      "default_ubuntu_21": "ubuntu",
      "default_ubuntu_22": "ubuntu"
    }
    const usernameBasedOnImage=usernameOnImageMapping[imageRef.split(",")[0]];
    return `ssh -F <path to SSH config file> -i <path to private sliver key> ${usernameBasedOnImage}@${managementIp}`
  }

  render() {
    const data = this.props.data;
    return (
      <div className="w-100 card ml-4">
        <form>
          <div className="card-header">
            Details
          </div>
          <div className="card-body">
            <div className="form-col px-3">
            {
              !data && (
                <span> Click an element to view details. </span>
              )
            }

            {
              data && data.properties && data.properties.class === "CompositeNode" &&
                <div className="row mb-2">
                  <label>Site Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
            }

            {
              data && data.properties && data.properties.type === "VM" &&
              <div>
                <div className="row mb-2">
                  <label>VM Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                {
                  data.properties.MgmtIp &&
                  <div className="row mb-2">
                    <label>Management IP Address</label>
                    <input type="text" className="form-control" defaultValue={data.properties.MgmtIp} disabled/>
                  </div>
                }
                {
                  data.properties.MgmtIp && data.properties.ImageRef &&
                  <div className="row mb-2">
                  <label>SSH Command <a
                    href={`${portalData.learnArticles.guideToLoginToFabricVMs}#project-permissions`} 
                    target="_blank" rel="noreferrer" className="ml-1">
                      <i className="fa fa-question-circle mx-2"></i>
                    </a>
                  </label>
                  <div className="ssh-command">
                    {this.sshCommand(data.properties.MgmtIp, data.properties.ImageRef)}
                    <CopyButton
                      id={this.sshCommand(data.properties.MgmtIp, data.properties.ImageRef)}
                      btnStyle={"btn btn-sm btn-secondary ml-2 py-0 px-1"}
                      showCopiedValue={false}
                      text=""
                    />
                  </div>
                </div>
                }
                <div className="row mb-2">
                  <label>Cores</label>
                  <input type="number" className="form-control" defaultValue={data.capacities.core} disabled/>
                </div>
                <div className="row mb-2">
                  <label>RAM(GB)</label>
                  <input type="number" className="form-control" defaultValue={data.capacities.ram} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Disk(GB)</label>
                  <input type="number" className="form-control" defaultValue={data.capacities.disk} disabled />
                </div>
              </div>
            }

            {
              data && data.properties && data.properties.class === "Component" &&
              <div>
                <div className="row mb-2">
                  <label >Component Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label >Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
                </div>
                <div className="row mb-2">
                  <label >Model</label>
                  <input type="text" className="form-control" defaultValue={data.properties.model} disabled/>
                </div>
                <div className="row mb-2">
                  <label >Detail</label>
                  <textarea disabled type="text" className="form-control" placeholder={data.properties.detail} />
                </div>
              </div>
            }

            {data && data.properties && data.properties.class === "ConnectionPoint" &&
              <div>
                <div className="row mb-2">
                  <label>Connection Point Name</label>
                  <input type="text" className="form-control" defaultValue={ data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
                </div>
                {
                  data.properties.mac &&
                  <div className="row mb-2">
                  <label>MAC Address</label>
                  <input type="text" className="form-control" defaultValue={data.properties.mac} disabled/>
                  </div>
                }
              </div>
            }

            {
              data && data.properties && data.properties.class === "NetworkService" &&
              <div>
                <div className="row mb-2">
                  <label>Network Service Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
                </div>
              </div>
            }
            </div>
            </div>
        </form>
      </div>
      );
  };
}
