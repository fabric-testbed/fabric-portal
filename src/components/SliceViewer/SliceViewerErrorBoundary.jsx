import { Component } from "react";
import CopyButton from "../common/CopyButton";
import { Link } from "react-router-dom";

export default class SliceViewerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
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

  render() {
    const { hasError } = this.state;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container d-flex align-items-center">
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
      );
    }

    return this.props.children;
  }
}
