import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import withRouter from "../components/common/withRouter.jsx";
import SpinnerWithText from "../components/common/SpinnerWithText";
import ProjectTags from "../components/SliceViewer/ProjectTags";
import SideNodes from '../components/SliceViewer/SideNodes';
import SideLinks from '../components/SliceViewer/SideLinks';
import Graph from '../components/SliceViewer/Graph';
import SliceEditorDetailForm from '../components/SliceViewer/SliceEditorDetailForm';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import sliceParser from "../services/parser/sliceParser.js";
import builder from "../utils/sliceBuilder.js";
import editor from "../utils/sliceEditor.js";
import validator from "../utils/sliceValidator.js";
import { sitesNameMapping }  from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import { getResources } from "../services/resourceService.js";
import { getSliceById, deleteSlice, extendSlice } from "../services/sliceService.js";
import { getProjectById } from "../services/projectService.js";
import { autoCreateTokens } from "../utils/manageTokens";
import { default as portalData } from "../services/portalData.json";

class SliceEditor extends React.Component {
  state = {
    sliceName: "",
    leaseEndTime: "",
    showSliceSpinner: false,
    sliceNodes: [],
    sliceLinks: [],
    selectedData: null,
    parsedResources: null,
    selectedCPs: [],
    originalSlice: {},
    elements: [],
    showResourceSpinner: false,
    project: {},
    projectTags: [],
    showProjectSpinner: false
  }

  async componentDidMount() {
    this.setState({ 
      showResourceSpinner: true,
      spinnerText: "Loading resources..."
    });
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
        const { data: resources } = await getResources(1);
        const { data: projectRes } = await getProjectById(this.props.match.params.project_id);
        const parsedObj = sitesParser(resources.data[0], sitesNameMapping.acronymToShortName);
        this.setState({
          parsedResources: parsedObj,
          showResourceSpinner: false,
          project: projectRes.results[0],
          projectTags: projectRes.results[0].tags,
          showProjectSpinner: false
        });
     } catch (err) {
      toast.error("User's credential is expired. Please re-login.");
    }
  }

  generateGraphElements = () => {
    const sliceJSON = {
      "directed": false,
      "multigraph": false,
      "graph": {},
      "nodes": this.state.sliceNodes,
      "links": this.state.sliceLinks,
    }

    let elements = sliceParser(sliceJSON, "new");

    return elements;
  }

  render() {
    const { sliceName, sshKey, selectedData,
      showKeySpinner, showResourceSpinner, showSliceSpinner, parsedResources,
      sliceNodes, sliceLinks, selectedCPs, originalSlice, elements,
      project, projectTags, showProjectSpinner  }
    = this.state;

    const validationResult = validator.validateSlice(sliceName, sshKey, sliceNodes);

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );
    
    return (
      <div>
        {
          !showResourceSpinner&& 
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
        <div className="d-flex flex-column align-items-center w-100">
          <div className="d-flex flex-row justify-content-center mb-4 w-100 mx-5">
            <div className="slice-builder-left">
            <div className="card">
                <div>
                  <div className="card-body slice-builder-card-body">
                    <ProjectTags
                       project={project}
                       tags={projectTags}
                       showSpinner={showProjectSpinner}
                    />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header slice-builder-card-header py-1">
                  <a
                    href={portalData.learnArticles.guideToSliceBuilderSections["step2"]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn btn-link">
                      Add Topology Elements
                    </button>
                  </a>
                </div>
                <div>
                  <div className="card-body slice-builder-card-body">
                    {
                      showResourceSpinner && <SpinnerWithText text={"Loading site resources..."}/>
                    }
                    {
                      !showResourceSpinner && 
                      <SideNodes
                        resources={parsedResources}
                        nodes={sliceNodes}
                        onVMAdd={this.handleVMAdd}
                        onFacilityAdd={this.handleFacilityAdd}
                      />
                    }
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header slice-builder-card-header py-1">
                  <a
                    href={portalData.learnArticles.guideToSliceBuilderSections["step3"]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn btn-link">
                      Add Network Services
                    </button>
                  </a>
                </div>
                <div>
                  <div className="card-body slice-builder-card-body">
                  <SideLinks
                    nodes={sliceNodes}
                    selectedCPs={selectedCPs}
                    onLinkAdd={this.handleLinkAdd}
                    onCPRemove={this.handleCPRemove}
                  />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header slice-builder-card-header py-1">
                  <a
                    href={portalData.learnArticles.guideToSliceBuilderSections["step4"]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn btn-link">
                      Submit Request
                    </button>
                  </a>
                </div>
                <div>
                  <div className="card-body slice-builder-card-body">
                    <div className="d-flex flex-column">
                      <form>
                        <div className="form-group col-md-12 d-flex flex-row">
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 100, hide: 300 }}
                            overlay={renderTooltip("slice-create-tooltip",
                              "The slice graph will be automatically saved to Draft when creating slice.")}
                          >
                            <button
                              className="btn btn-sm btn-success mt-2"
                              type="button"
                              disabled={!validationResult.isValid}
                              onClick={() => this.handleCreateSlice()}
                            >
                              Modify Slice
                            </button>
                        </OverlayTrigger>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="slice-builder-right">
              <SliceEditorDetailForm
                data={selectedData}
                selectedCPs={selectedCPs}
                nodes={sliceNodes}
                links={sliceLinks}
                onConnectionPointSelect={this.handleCPAdd}
                onNodeDelete={this.handleNodeDelete}
                onVMUpdate={this.handleVMUpdate}
                onSingleComponentAdd={this.handleSingleComponentAdd}
                onJsonUpload={this.handleJsonUpload}
              />
              <Graph
                className="align-self-end"
                isNewSlice={true}
                elements={this.generateGraphElements()}
                sliceName={sliceName === "" ? "new-slice" : sliceName}
                defaultSize={{"width": 0.6, "height": 0.9, "zoom": 1}}
                onNodeSelect={this.handleNodeSelect}
                onSaveDraft={() => this.handleSaveDraft("withMessage")}
                onUseDraft={this.handleUseDraft}
                onClearGraph={this.handleClearGraph}
                onSaveJSON={this.handleSaveJSON}
              />
            </div>
            </div>
        </div>
      </div>
    )
  }
}

export default withRouter(SliceEditor);

