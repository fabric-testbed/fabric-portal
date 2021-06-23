import React from "react";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

class Experiments extends React.Component {

  state = {
    created_token: "",
    copySuccess: "",
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
      this.setState({ created_token: this.generateTokenJson("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUz") });
    } catch (ex) {
      toast.error("Failed to create token.");
    }
  }

  copyToken = (e) => {
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: 'Copied!' });
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
            <Card.Header className="d-flex bg-light">
              <Button
                onClick={this.copyToken}
                variant="primary"
                size="sm"
                className="mr-3"
              >
                Copy
              </Button>
              <Button variant="primary" size="sm">Download</Button>
              {this.state.copySuccess}
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control
                  ref={(textarea) => this.textArea = textarea}
                  as="textarea"
                  placeholder={this.state.created_token}
                  rows={4}
                />
              </Form.Group>
            </Card.Body>
          </Card>
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