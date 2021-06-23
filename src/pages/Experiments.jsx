import React from "react";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

class Experiments extends React.Component {

  state = {
    created_token: "",
    copySuccess: false,
  }

  generateTokenJson = (id_token) => {
    // format:
    //   {
    //     "created_at": "Timestamp at which the tokens were generated",
    //     "id_token": "Identity Token",
    //     "refresh_token": "Refresh Token"
    //   }
    const res_json = {"created_at" : Date.now(), "id_token": id_token};
    
    return JSON.stringify(res_json, undefined, 4);
  }

  createToken = async () => {
    try {
      // const { data } = await createIdToken();
      this.setState({ copySuccess: false });
      this.setState({ created_token: this.generateTokenJson("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUz") });
    } catch (ex) {
      toast.error("Failed to create token.");
    }
  }

  copyToken = (e) => {
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: true });
  }

  downloadToken = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById('createTokenTextArea').value], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "id_token.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
                <Form.Control as="select">
                  <option>All</option>
                  <option>Project Name 1</option>
                  <option>Project Name 2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Scope</Form.Label>
                <Form.Control as="select">
                  <option>All</option>
                  <option>Control Framework</option>
                  <option>Measurement Framework</option>
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
          <Card>
            <Card.Header className="d-flex flex-row bg-light">
              <Button
                onClick={this.copyToken}
                variant="primary"
                size="sm"
                className="mr-3"
              >
                Copy
              </Button>
              <Button
                onClick={this.downloadToken}
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
                  defaultValue={this.state.created_token}
                  rows={4}
                />
              </Form.Group>
            </Card.Body>
          </Card>
          {this.state.copySuccess && (
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
                <Form.Control as="select">
                  <option>All</option>
                  <option>Project Name 1</option>
                  <option>Project Name 2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Scope</Form.Label>
                <Form.Control as="select">
                  <option>All</option>
                  <option>Control Framework</option>
                  <option>Measurement Framework</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Card>
            <Card.Header className="d-flex bg-light">
              Input the refresh token value:
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows={4} />
              </Form.Group>
            </Card.Body>
          </Card>
        </Form>
        <Button
          className="btn-success mt-3"
        >
          Refresh Token
        </Button>
        <h2 className="my-4">Revoke Token</h2>
          <Card>
            <Card.Header className="d-flex bg-light">
              Paste the token to revoke:
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows={4} />
              </Form.Group>
            </Card.Body>
          </Card>
        <Button
          className="btn-danger mt-3"
        >
          Revoke Token
        </Button>
      </div>
    )
  }
}

export default Experiments;