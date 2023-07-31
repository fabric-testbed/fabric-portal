import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import withRouter from "../common/withRouter.jsx";
import SpinnerWithText from "../common/SpinnerWithText";
import ProjectTags from "./ProjectTags";
import SideNodes from './SideNodes';
import SideLinks from './SideLinks';
import Graph from './Graph';
import SliceEditorDetailForm from './SliceEditorDetailForm';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import sliceParser from "../../services/parser/sliceParser.js";
import builder from "../../utils/sliceBuilder.js";
import editor from "../../utils/sliceEditor.js";
import validator from "../../utils/sliceValidator.js";
import { sitesNameMapping }  from "../../data/sites";
import sitesParser from "../../services/parser/sitesParser";
import { getResources } from "../../services/resourceService.js";
import { getSliceById, deleteSlice, extendSlice } from "../services/sliceService.js";
import { autoCreateTokens } from "../../utils/manageTokens";
import { getActiveKeys } from "../../services/sshKeyService";
import { default as portalData } from "../../services/portalData.json";

class SliceEditor extends React.Component {
  state = {
    sliceName: "",
    leaseEndTime: "",
    showResourceSpinner: false,
    showKeySpinner: false,
    showSliceSpinner: false,
    sliceNodes: [],
    sliceLinks: [],
    selectedData: null,
    parsedResources: null,
    selectedCPs: [],
    originalSlice: {},
    elements: []
  }

  async componentDidMount() {
    this.setState({ showSpinner: true, spinnerText: "Loading slice..." });
    try {
        // call credential manager to generate tokens
        autoCreateTokens(this.props.match.params.project_id).then(async () => {
          const { data: res } = await getSliceById(this.props.match.params.slice_id);
          this.setState({ 
            elements: sliceParser(res.data[0]["model"]),
            originalSlice: res.data[0],
            leaseEndTime: res.data[0].lease_end_time,
            showSpinner: false,
            spinnerText: ""
          });
        });
     } catch (err) {
      toast.error("User's credential is expired. Please re-login.");
    }
  }

  render() {
    const { originalSlice, showSliceSpinner }
    = this.state;

    return (
      <div>
      {
        !showSliceSpinner && 
        <div>
          <div className="d-flex flex-row justify-content-between mt-2">
            <div className="align-self-start d-flex flex-row">
              <h2 className="ml-5 my-2">
                { originalSlice.name }
              </h2>
              <a
                href={portalData.learnArticles.guideToSliceBuilder}
                target="_blank"
                rel="noreferrer"
                className="mt-3"
              >
                <i className="fa fa-question-circle mx-2"></i>
                User Guide
              </a>
            </div>
            <Link to={`/projects/${this.props.match.params.project_id}`} className="align-self-end mr-5">
              <button
                className="btn btn-sm btn-outline-primary my-3"
              >
                <i className="fa fa-exchange mr-2"></i>
                View Mode
              </button>
            </Link>
          </div>
        </div>
      }
      </div>
    )
  }
}

export default withRouter(SliceEditor);

