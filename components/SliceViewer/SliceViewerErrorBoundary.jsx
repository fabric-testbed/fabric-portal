import { Component } from "react";
import CopyButton from "../common/CopyButton";
import Link from "next/link";
import DeleteModal from "../common/DeleteModal";
import { toast } from "react-toastify";
import { default as portalData } from "../../services/portalData.json";
import sleep from "../../utils/sleep";
import { deleteSlice} from "../../services/sliceService.js";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import CalendarDateTime from "../common/CalendarDateTime.jsx";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";

export default class SliceViewerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like AppSignal
    // logErrorToMyService(error, errorInfo);
    if (error.message) {
      console.log(`Failed to render the slice topology: ${error.message}`);
    }
  }

  handleDeleteSlice = async (id) => {
    try {
      await deleteSlice(id);
      // toast message to users when the api call is successfully done.
      toast.success("Slice deleted successfully.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete the slice.");
    }
  }

  render() {
    const { hasError } = this.state;
    const { slice, leaseStartTime, leaseEndTime } = this.props;
 
    const stateColors = {
      "Nascent": "primary-dark",
      "StableOK": "success",
      "AllocatedOK": "success",
      "AllocatedError": "warning",
      "StableError": "warning",
      "Closing": "secondary",
      "Dead": "secondary",
      "Configuring": "primary",
      "Modifying": "primary",
      "ModifyError": "warning",
      "ModifyOK": "success"
    }

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="slice-page-container">
          <div className="mx-5 mb-4 slice-viewer-container">
            <div className="d-flex flex-row justify-content-between align-items-center mt-2">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <h2 className="me-3">
                  <b>{slice.name}</b>
                  <span className={`badge bg-${stateColors[slice.state]} ms-2`}>
                    {slice.state}
                  </span>
                  <a
                    href={portalData.learnArticles.guideToSliceBuilderSections["states"]}
                    target="_blank"
                    rel="noreferrer"
                    className="ms-1"
                  >
                    <i className="fa fa-question-circle mx-2" />
                  </a>
                </h2>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                {
                  ["StableOK", "ModifyOK", "StableError", "ModifyError"].includes(slice.state) &&
                  <DeleteModal
                    name={"Delete Slice"}
                    text={'Are you sure you want to delete this slice? This process cannot be undone but you can find deleted slices by checking the "Include Dead Slices" radio button on Experiments -> Slices page.'}
                    id={"delete-a-slice"}
                    onDelete={() => this.handleDeleteSlice(slice.slice_id)}
                  />
                }
                <Link href="/experiments#slices">
                  <button
                    className="btn btn-sm btn-outline-primary my-3 ms-3"
                  >
                    <i className="fa fa-sign-in me-2"></i>
                    Back to Slice List
                  </button>
                </Link>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex align-items-center">
                <div className="alert alert-danger" role="alert">
                  <h2 className="fw-semibold lh-1">{`Ooops, something went wrong in displaying this slice topology :(`}</h2>
                  <ul>
                  <li className="my-3">
                  Please note that the Portal does not support all the slice and experiment management capabilities available in 
                  Jupyter Hub and FABlib. Some newer features may still be in development.
                  </li>
                  <li className="my-3">
                  To learn more about which slice and experiment management features the Portal supports in the current version, please visit <b>
                    <a href="https://learn.fabric-testbed.net/knowledge-base/fabric-portal-release-notes/" target="_blank" rel="noreferrer">
                      FABRIC Portal Release Notes</a></b> and <b><a href="https://learn.fabric-testbed.net/article-categories/portal/" target="_blank" rel="noreferrer">
                    FABRIC Knowledge Base -&gt; Technical Guides -&gt; Portal</a></b>.
                  </li>
                  <li className="my-3">
                  If you believe you encountered a bug in the way the Portal visualizes or manages your slice, please <b>report this issue</b> in the <b>
                      <a href="https://learn.fabric-testbed.net/forums/forum/fabric-general-questions-and-discussion/" target="_blank" rel="noreferrer">
                      <i className="fa fa-sign-in me-1"></i> FABRIC forum</a></b> and the FABRIC 
                    development team will debug it soon. (Remember to include the <b>Slice ID <i>{this.props.sliceID}</i></b> in the post.).
                  </li>
                  </ul>
                  <div className="my-2 d-flex justify-content-center align-items-center">
                    <CopyButton
                      id={this.props.sliceID}
                      text={"Copy Slice ID"}
                      btnStyle={"btn btn-sm btn-primary ms-2"}
                      showCopiedValue={true}
                    />
                    <Link href="/experiments#slices">
                      <button
                        className="btn btn-sm btn-primary my-3 ms-3"
                      >
                        <i className="fa fa-sign-in me-2"></i>
                        Back to Slice List
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-100 card ms-4">
                <form>
                  <div className="card-header">
                    Details
                  </div>
                  <div className="card-body">
                    <div className="form-col px-3">
                      <div>
                        <div className="row mb-2">
                          <label>Project</label>
                          <div className="slice-form-element">
                            <Link href={`/projects/${slice.project_id}`}>{slice.project_name}</Link>
                          </div>
                        </div>
                        <div className="row d-flex flex-column mb-2">
                          <label>
                            Lease Start at
                          </label>
                            <div className="slice-form-element">
                              {utcToLocalTimeParser(leaseStartTime)}
                            </div>
                        </div>
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
                                <i className="fa fa-question-circle text-secondary ms-2"></i>
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
                                <CalendarDateTime
                                  id="sliceViewerCalendar"
                                  name="sliceViewerCalendar"
                                  offset={-1}
                                  onTimeChange={this.props.onLeaseEndChange}
                                  time={new Date(utcToLocalTimeParser(leaseEndTime).replace(/-/g, "/"))}
                                />
                              </div>
                              <button
                                className="btn btn-sm btn-outline-primary mt-2 me-3"
                                onClick={this.props.onSliceExtend}
                              >
                                Extend
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
