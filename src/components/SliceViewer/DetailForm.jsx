import React, { Component } from 'react'
import CopyButton from "../common/CopyButton";
import { Link } from "react-router-dom";
import { default as portalData } from "../../services/portalData.json";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import Calendar from "../../components/common/Calendar";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class DetailForm extends Component {
  sshCommand = (managementIp, imageRef) => {
    const usernameBasedOnImage= portalData.usernameOnImageMapping[imageRef.split(",")[0]];
    return `ssh -F <path to SSH config file> -i <path to private sliver key> ${usernameBasedOnImage}@${managementIp}`
  }

  render() {
    const { slice, data, leaseEndTime } = this.props;

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );
    return (
      <div className="w-100 card ml-4">
        <form>
          <div className="card-header">
            Details
          </div>
          <div className="card-body">
            {
              !data && <div className="alert alert-primary px-2 mb-2" role="alert">
                <i className="fa fa-hand-pointer-o mx-1"></i>
                Click an element on the topology to view details.
              </div>
            }
            <div className="form-col px-3">
            {
              !data && (
                <div>
                  {
                    slice.project_name && <div className="row mb-2">
                      <label>Project</label>
                      <div className="slice-form-element">
                        <Link to={`/projects/${slice.project_id}`}>{slice.project_name}</Link>
                      </div>
                    </div>
                  }
                  <div className="row d-flex flex-column mb-2">
                    <label>
                      Lease End at
                      {
                        slice.state === "StableOK" &&
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 100, hide: 300 }}
                          overlay={renderTooltip("lease-end-tooltip", "You can extend up to 15 days as of now.")}
                        >
                          <i className="fa fa-question-circle text-secondary ml-2"></i>
                        </OverlayTrigger>
                      }
                    </label>
                    {
                      slice.state !=="StableOK" &&
                      <div className="slice-form-element">
                        {utcToLocalTimeParser(leaseEndTime)}
                      </div>
                    }
                    {
                      leaseEndTime && slice.state ==="StableOK" &&
                      <div>
                        <div className="slice-form-element mb-1">
                          <Calendar
                            id="sliceViewerCalendar"
                            name="sliceViewerCalendar"
                            onTimeChange={this.props.onLeaseEndChange}
                            parent={"sliceDetailForm"}
                            currentTime={new Date(utcToLocalTimeParser(leaseEndTime).replace(/-/g, "/"))}
                          />
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary mt-2 mr-3"
                          onClick={this.props.onSliceExtend}
                        >
                          Extend
                        </button>
                      </div>
                    }
                  </div>
                </div>
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
                    {
                      slice.state === "StableOK" &&
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary ml-2"
                        data-toggle="modal"
                        data-target="#TerminalFormModalCenter"
                        onClick={this.props.onGenerateEphemeralKey(data.properties.sliverId)}
                      >
                        Connect to VM
                      </button>
                    }
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
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.capacities.core > 0? data.capacities.core : "configuring"}
                    disabled
                  />
                </div>
                <div className="row mb-2">
                  <label>RAM(GB)</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.capacities.ram > 0? data.capacities.ram : "configuring"}
                    disabled
                  />
                </div>
                <div className="row mb-2">
                  <label>Disk(GB)</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.capacities.disk > 0? data.capacities.disk : "configuring"}
                    disabled
                  />
                </div>
              </div>
            }

            {
              data && data.properties && data.properties.type === "Facility" &&
              <div>
                <div className="row mb-2">
                  <label>Facility Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
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

            {
             data && data.properties && data.properties.class === "ConnectionPoint" && data.properties.type && data.properties.type !== "FacilityPort" &&
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
            data && data.properties && data.properties.type && data.properties.type === "FacilityPort" &&
            <div>
              <div className="row mb-2">
                <label>Facility Port Name</label>
                <input type="text" className="form-control" defaultValue={ data.properties.name} disabled/>
              </div>
              <div className="row mb-2">
                <label>Type</label>
                <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
              </div>
              {
                data.capacities.bw &&
                <div className="row mb-2">
                <label>Bandwidth</label>
                <input type="number" className="form-control" defaultValue={data.capacities.bw} disabled/>
                </div>
              }
              {
                data.labels && data.labels.vlan && 
                <div className="row mb-2">
                  <label>VLAN</label>
                  <input type="number" className="form-control" defaultValue={data.labels.vlan} disabled/>
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
            {
              data &&
              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => this.props.clearSelectedData()}
              >
                View Slice Details
              </button>
            }
            </div>
        </form>
      </div>
      );
  };
}
