import React from "react";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import SpinnerWithText from "../../components/common/SpinnerWithText";
import { createIdToken } from "../../services/credentialManagerService.js";
import { getCurrentUser } from "../../services/peopleService.js";
import { toast } from "react-toastify";
import { default as portalData } from "../../services/portalData.json";

class Tokens extends React.Component {
  state = {
    projects: [],
    createToken: "",
    createSuccess: false,
    createCopySuccess: false,
    scopeOptions: [
      { id: 1, value: "all", display: "All"},
      { id: 2, value: "cf", display: "Control Framework"},
      { id: 3, value: "mf", display: "Measurement Framework"},
    ],
    selectedCreateScope: "all",
    selectedProjectId: "",
    showSpinner: false,
  }

  async componentDidMount(){
    // Show loading spinner and when waiting API response
    this.setState({ showSpinner: true });

    try {
      const { data: user } = await getCurrentUser();
      this.setState({ projects: user.projects, showSpinner: false });
    } catch (ex) {
      console.log("Failed to load user information: " + ex.response.data);
      window.location.href = "/logout";
      toast.error("User's credential is expired. Please re-login.");
    }
  }

  generateTokenJson = (id_token, refresh_token) => {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    const time_stamp = date + ' '+ time;

    const res_json = {
      "created_at" : time_stamp,
      "id_token": id_token,
      "refresh_token": refresh_token,
    };
    
    return JSON.stringify(res_json, undefined, 4);
  }

  createToken = async () => {
    try {
      const projectId = this.state.selectedProjectId;
      const scope = this.state.selectedCreateScope;
      const { data } = await createIdToken(projectId, scope);
      this.setState({ createCopySuccess: false, createSuccess: true });
      this.setState({ createToken: this.generateTokenJson(data.id_token, data.refresh_token) });
    } catch (ex) {
      toast.error("Failed to create token.");
    }
  }

  downloadToken = (e, option) => {
    // download token.
    const element = document.createElement("a");
    const file = new Blob([document.getElementById(`${option}TokenTextArea`).value], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "tokens.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    // Force logout.
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userID");
    window.location.href = "/logout";
  }

  handleSelectCreateProject = (e) =>{
    this.setState({ selectedProjectId: e.target.value });
  }

  handleSelectCreateScope = (e) =>{
    this.setState({ selectedCreateScope: e.target.value });
  }

  render() {
    return (
      <div className="col-9">
        {
          this.state.showSpinner && <SpinnerWithText text={"Loading projects to create token..."} />
        }
        {
          !this.state.showSpinner &&
          <div>
            <h1 className="mb-4">Create Token</h1>
            <div className="alert alert-primary mb-2" role="alert">
              Please consult &nbsp;
              <a
                href="https://learn.fabric-testbed.net/knowledge-base/obtaining-and-using-fabric-api-tokens/"
                target="_blank"
                rel="noreferrer"
              >
                this guide
              </a>&nbsp;
              for obtaining and using FABRIC API tokens.
            </div>
            { this.state.projects.length === 0 &&
                <div className="alert alert-warning mt-4" role="alert">
                  <p className="mt-2">To create tokens, you have to be in a project first:</p>
                  <p>
                    <ul>
                      <li>
                        If you are a <a href={portalData.starterFAQLink} target="_blank" rel="noreferrer">professor or research staff member at your institution</a>, 
                        please <Link to="/user">request to be FABRIC Project Lead</Link> from User Profile -&gt; My Roles &amp; Projects page then you can create a project.
                      </li>
                      <li>
                        If you are a <a href={portalData.starterFAQLink} target="_blank" rel="noreferrer">student or other contributor</a>, 
                        please ask your project lead to add you to a project.
                      </li>
                    </ul>
                  </p>
                </div>
            }
            {
              this.state.projects.length > 0 &&
              <Form>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Select Project</Form.Label>
                      <Form.Control as="select" onChange={this.handleSelectCreateProject}>
                        <option value="">Choose...</option>
                        {
                          this.state.projects.map(project => {
                            return (
                              <option value={project.uuid}>{project.name}</option>
                            )
                          })
                        }
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Select Scope</Form.Label>
                      <Form.Control as="select" onChange={this.handleSelectCreateScope}>
                        { 
                          this.state.scopeOptions.map(option => {
                            return (
                              <option
                                id={`createTokenScope${option.id}`}
                                value={option.value}
                              >
                                {option.display}
                              </option>
                            )
                          })
                        }
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={2} className="d-flex flex-row align-items-center justify-content-end">
                    <Button
                      className="btn-success mt-3 w-75"
                      onClick={this.createToken}
                      disabled={this.state.selectedProjectId === ""}
                    >
                      Create
                    </Button>
                  </Col>
                </Row>
                {
                  this.state.createSuccess && 
                  <div>
                    <Alert variant="success">
                      <i className="fa fa-check-circle"></i> Tokens are successfully generated! Click the <b>Download</b> button 
                      to save id token and refresh token. 
                    </Alert>
                    <Alert variant="warning">
                      <i className="fa fa-exclamation-triangle"></i> The portal will log out automatically. Please log in again after the download.
                    </Alert>
                    <Button
                      onClick={e => this.downloadToken(e, "create")}
                      variant="primary"
                      size="md"
                    >
                      Download
                    </Button>
                    <Card style={{display: "none"}}>
                      <Card.Body>
                        <Form.Group>
                          <Form.Control
                            ref={(textarea) => this.textArea = textarea}
                            as="textarea"
                            id="createTokenTextArea"
                            defaultValue={this.state.createToken}
                            rows={6}
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </div>
                }
              </Form>
            }
          </div>
        }
      </div>
    )
  }
}

export default Tokens;