import { Component } from "react";
import CopyButton from "../common/CopyButton";
import { Link } from "react-router-dom";
import DetailForm from './DetailForm';
import DeleteModal from "../common/DeleteModal";
import { toast } from "react-toastify";
import { default as portalData } from "../../services/portalData.json";
import sleep from "../../utils/sleep";
import moment from 'moment';
import { deleteSlice, extendSlice } from "../../services/sliceService.js";

export default class SliceViewerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: true,
      leaseEndTime: this.props.slice.lease_end_time
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

  handleLeaseEndChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");
    this.setState({ leaseEndTime: outputTime });
  }

  handleSliceExtend = async () => {
    this.setState({
      showSpinner: true,
      spinnerText: "Extending slice..."
    })
    try {
      const { slice, leaseEndTime } = this.state;
      await extendSlice(slice.slice_id, leaseEndTime);
      // toast message to users when the api call is successfully done.
      toast.success("Slice has been successfully renewed.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to renew the slice.");
      this.setState({
        leaseEndTime: this.state.slice.lease_end_time,
        showSpinner: false,
        spinnerText: ""
      });
    }
  }

  handleDeleteSlice = async (id) => {
    try {
      await deleteSlice(id);
      // toast message to users when the api call is successfully done.
      toast.success("Slice deleted successfully.");
      // change slice state to Dead.
      this.setState(prevState => ({ 
        slice: {
          ...prevState.slice,
          "state": "Dead"
        }
      }))
    } catch (err) {
      toast.error("Failed to delete the slice.");
    }
  }

  render() {
    const { hasError, leaseEndTime } = this.state;
    const { slice } = this.props;
 
    const stateColors = {
      "Nascent": "primary-dark",
      "StableOK": "success",
      "StableError": "warning",
      "Closing": "secondary",
      "Dead": "secondary",
      "Configuring": "primary",
      "Modifying": "primary",
      "ModifyError": "warning",
      "ModifyOK": "success"
    }

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="slice-page-container">
          <div className="mx-5 mb-4 slice-viewer-container">
          <div className="d-flex flex-row justify-content-between align-items-center mt-2">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <h2 className="mr-3">
                    <b>{slice.name}</b>
                    <span className={`badge badge-${stateColors[slice.state]} ml-2`}>
                      {slice.state}
                    </span>
                    <a
                      href={portalData.learnArticles.guideToSliceBuilderSections["states"]}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1"
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
                  <Link to="/experiments#slices">
                    <button
                      className="btn btn-sm btn-outline-primary my-3 ml-3"
                    >
                      <i className="fa fa-sign-in mr-2"></i>
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
                        <i className="fa fa-sign-in mr-1"></i> FABRIC forum</a></b> and the FABRIC 
                      development team will debug it soon. (Remember to include the <b>Slice ID: <i>{this.props.sliceID}</i></b> in the post.).
                    </li>
                    </ul>
                    <div className="my-2 d-flex justify-content-center align-items-center">
                      <CopyButton
                        id={this.props.sliceID}
                        text={"Copy Slice ID"}
                        btnStyle={"btn btn-sm btn-primary ml-2"}
                        showCopiedValue={true}
                      />
                      <Link to="/experiments#slices">
                        <button
                          className="btn btn-sm btn-primary my-3 ml-3"
                        >
                          <i className="fa fa-sign-in mr-2"></i>
                          Back to Slice List
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <DetailForm
                  slice={slice}
                  leaseEndTime={leaseEndTime}
                  onLeaseEndChange={this.handleLeaseEndChange}
                  onSliceExtend={this.handleSliceExtend}
                />
              </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
