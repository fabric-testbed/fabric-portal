import React from "react";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { createIdToken, refreshToken, revokeToken } from "../services/credentialManagerService.js";
import { getCurrentUser } from "../services/prPeopleService.js";

import { toast } from "react-toastify";

class Experiments extends React.Component {

  state = {
    projects: [],
    createToken: "",
    refreshToken: "",
    createSuccess: false,
    createCopySuccess: false,
    refreshSuccess: false,
    refreshCopySuccess: false,
    revokeSuccess: false,
    scopeOptions: [
      { id: 1, value: "all", display: "All"},
      { id: 2, value: "cf", display: "Control Framework"},
      { id: 3, value: "mf", display: "Measurement Framework"},
    ],
    selectedCreateScope: "all",
    selectedRefreshScope: "all",
    selectedCreateProject: "all",
    selectedRefreshProject: "all",
  }

  async componentDidMount(){
    try {
      const { data: user } = await getCurrentUser();
      this.setState({ projects: user.projects });
    } catch (ex) {
      toast.error("Failed to load user's project information. Please reload this page.");
      console.log("Failed to load user information: " + ex.response.data);
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
      const project = this.state.selectedCreateProject;
      const scope = this.state.selectedCreateScope;
      const { data } = await createIdToken(project, scope);
      this.setState({ createCopySuccess: false, createSuccess: true });
      this.setState({ createToken: this.generateTokenJson(data.id_token, data.refresh_token) });
    } catch (ex) {
      toast.error("Failed to create token.");
    }
  }

  refreshToken = async () => {
    try {
      const project = this.state.selectedRefreshProject;
      const scope = this.state.selectedRefreshScope;
      const { data } = await refreshToken(project, scope, document.getElementById('refreshTokenTextArea').value);
      this.setState({ refreshCopySuccess: false, refreshSuccess: true });
      this.setState({ refreshToken: this.generateTokenJson(data.id_token, data.refresh_token) });
    }
    catch (ex) {
      this.setState({ refreshSuccess: false });
      toast.error("Please re-login to refresh the token again.")
    }
  }

  revokeToken = async () => {
    try {
      await revokeToken(document.getElementById('revokeTokenTextArea').value);
      this.setState({ revokeSuccess: true });
    }
    catch (ex) {
      this.setState({ revokeSuccess: false });
      toast.error("Failed to revoke token.")
    }
  }

  copyToken = (e, option) => {
    document.getElementById(`${option}TokenTextArea`).select();
    document.execCommand('copy');
    e.target.focus();
    if (option === "create") {
      this.setState({ createCopySuccess: true });
    }
    if (option === "refresh") {
      this.setState({ refreshCopySuccess: true });
    }
  }

  downloadToken = (e, option) => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById(`${option}TokenTextArea`).value], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "id_token.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  handleSelectCreateProject = (e) =>{
    this.setState({ selectedCreateProject: e.target.value });
  }

  handleSelectRefreshProject = (e) =>{
    this.setState({ selectedRefreshProject: e.target.value });
  }


  handleSelectCreateScope = (e) =>{
    this.setState({ selectedCreateScope: e.target.value });
  }

  handleSelectRefreshScope = (e) =>{
    this.setState({ selectedRefreshScope: e.target.value });
  }

  render() {
    return (
      <div className="container">
        <h2 className="mb-4">Create Token</h2>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Project</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectCreateProject}>
                  <option value="all">All</option>
                  {
                    this.state.projects.map(project => {
                      return (
                        <option value={project.name}>{project.name}</option>
                      )
                    })
                  }
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
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
                className="btn-success mt-3"
                onClick={this.createToken}
              >
                Create Token
              </Button>
            </Col>
          </Row>
          { this.state.createSuccess && (
            <Card>
              <Card.Header className="d-flex flex-row bg-light">
                <Button
                  onClick={e => this.copyToken(e, "create")}
                  variant="primary"
                  size="sm"
                  className="mr-3"
                >
                  Copy
                </Button>
                <Button
                  onClick={e => this.downloadToken(e, "create")}
                  variant="primary"
                  size="sm"
                >
                  Download
                </Button>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
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
          )}
          {this.state.createCopySuccess && (
            <Alert variant="success">
              Copied to clipboard successfully!
            </Alert>
          )}
        </Form>
        <h2 className="my-4">Refresh Token</h2>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Project</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectRefreshProject}>
                  <option value="all">All</option>
                  {
                    this.state.projects.map(project => {
                      return (
                        <option value={project.name}>{project.name}</option>
                      )
                    })
                  }
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Scope</Form.Label>
                <Form.Control as="select" onChange={this.handleSelectRefreshScope}>
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
          </Row>
          {!this.state.refreshSuccess && (
            <Card>
              <Card.Header className="d-flex bg-light">
                Input the refresh token value:
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                  as="textarea"
                  rows={3}
                  id="refreshTokenTextArea"
                />
                </Form.Group>
              </Card.Body>
            </Card>
          )}
          {this.state.refreshSuccess && (
            <Card>
            <Card.Header className="d-flex flex-row bg-light">
              <Button
                onClick={e => this.copyToken(e, "refresh")}
                variant="primary"
                size="sm"
                className="mr-3"
              >
                Copy
              </Button>
              <Button
                onClick={e => this.downloadToken(e, "refresh")}
                variant="primary"
                size="sm"
              >
                Download
              </Button>
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control
                  ref={(textarea) => this.textArea = textarea}
                  as="textarea"
                  id="refreshTokenTextArea"
                  defaultValue={this.state.refreshToken}
                  rows={6}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        )}
        {this.state.refreshSuccess && this.state.createCopySuccess && (
          <Alert variant="success">
            Copied to clipboard successfully!
          </Alert>
        )}
        </Form>
        {
          !this.state.refreshSuccess && (
            <Button
              onClick={this.refreshToken}
              className="btn-success mt-3"
            >
              Refresh Token
            </Button>
          )
        }
        <h2 className="my-4">Revoke Token</h2>
          <Card>
            <Card.Header className="d-flex bg-light">
              Paste the refresh token to revoke:
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control
                  as="textarea"
                  rows={3}
                  id="revokeTokenTextArea"
                  onChange={this.changeRevokeToken}
                />
              </Form.Group>
            </Card.Body>
          </Card>
          {this.state.revokeSuccess && (
            <Alert variant="success">
              The token is revoked successfully!
            </Alert>
          )}
        <Button
          onClick={this.revokeToken}
          className="btn-danger mt-3"
        >
          Revoke Token
        </Button>
      </div>
    )
  }
}

export default Experiments;