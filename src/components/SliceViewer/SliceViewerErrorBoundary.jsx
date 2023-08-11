import { Component } from "react";
import CopyButton from "../common/CopyButton";

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
              Please note that 
              Portal Slice Builder and Slice Viewer capabilities are lagging behind what are available
              in the JupyterHub and FABLib. Some new testbed features (FPGAs, Persistent Storage, etc.) are 
              still in development for FABRIC Portal.
            </li>
            <li className="my-3">
            To learn more about what features Portal Slice Builder and Slice Viewer support in the current version, 
            please read <b>
              <a href="https://learn.fabric-testbed.net/knowledge-base/fabric-portal-release-notes/" target="_blank" rel="noreferrer">
                FABRIC Portal Release Notes</a></b> and <b><a href="https://learn.fabric-testbed.net/article-categories/portal/" target="_blank" rel="noreferrer">
              FABRIC Knowledge Base -&gt; Technical Guides -&gt; Portal</a></b>.
            </li>
            <li className="my-3">
              If this slice doesn't include unavailable capabilities, please <b>report this issue</b> in the <b>
                <a href="https://learn.fabric-testbed.net/forums/forum/fabric-general-questions-and-discussion/" target="_blank" rel="noreferrer">
                <i className="fa fa-sign-in mr-1"></i> FABRIC forum</a></b> and the FABRIC 
               development team will debug it soon. (Remember to include the <b>Slice ID: <i>{this.props.sliceID}</i></b> in the post.).
            </li>
            </ul>
            <div className="my-2 d-flex justify-content-center">
              <CopyButton
                id={this.props.sliceID}
                text={"Copy Slice ID"}
                btnStyle={"btn btn-sm btn-primary ml-2"}
                showCopiedValue={true}
              />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
