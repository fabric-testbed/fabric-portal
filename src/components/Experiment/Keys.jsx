import React from "react";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";
import KeysTable from "./KeysTable";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown'

import { getKeys } from "../../services/fakeSSHKeys.js";

import paginate from "../../utils/paginate";
import _ from "lodash";

class Keys extends React.Component {
  state = {
    keys: getKeys(),
    allKeys: getKeys(),
    pageSize: 3,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {

  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleKeyGenerate = () => {

  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      keys: allKeys,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allKeys;
    if (searchQuery) {
      filtered = allKeys.filter((k) =>
        k.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const keys = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: keys };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="col-9">
        <h1>SSH Keys</h1>
        <div className="toolbar">
          <SearchBox
            value={searchQuery}
            placeholder={"Search SSH Keys by Name..."}
            onChange={this.handleSearch}
            className="my-0"
          />
        </div>
        <div className="my-2">
          Showing {totalCount} keys.
        </div>
        <KeysTable
          keys={data}
          sortColumn={sortColumn}
          onSort={this.handleSort}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
        <h3 className="my-4">Generate SSH Key Pair</h3>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Input the Key Pair Name..."
            aria-label="SSH Key Name"
          />
          <Dropdown>
            <Dropdown.Toggle variant="outline-success" className="ml-4">
              Select Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Bastion</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Sliver</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            className="ml-4"
            variant="success"
            onClick={this.handleKeyGenerate}
            data-toggle="modal"
            data-target="#generatedKeyModal"
          >
            Generate Key Pair
          </Button>
          <div
            className="modal fade"
            id={"generatedKeyModal"}
            data-backdrop="static"
            data-keyboard="false"
            tabIndex="-1"
            role="dialog"
            aria-labelledby={"generatedKeyModal-title"}
            aria-hidden="true"
          >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Generated Key Pair
                </h5>
                <button className="btn btn-sm btn-outline-secondary" data-dismiss="modal" aria-label="Close">
                  <i className="fa fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <li>
                  Public Key: <a href="#">your_key_name.pub</a>
                  <button className="btn btn-outline-primary btn-sm ml-2">
                    <i className="fa fa-download"></i>
                  </button>
                </li>
                <li className="my-4">
                  Private Key: <a href="#">your_key_name</a>
                  <button className="btn btn-outline-primary btn-sm ml-2">
                    <i className="fa fa-download"></i>
                  </button>
                </li>
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  The private key will be no longer accessible through the portal once you closed this window.
                  Please download and keep your private keys safe.
                </div>
              </div>
            </div>
          </div>
        </div>
        </InputGroup>
        <h3 className="my-4">Upload Public Key</h3>
        <Card>
          <Card.Header className="d-flex flex-row bg-light">
            Please paste the public key here:
          </Card.Header>
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
        <InputGroup className="my-3">
          <FormControl
            placeholder="Input the Public Key Name..."
            aria-label="SSH Key Name"
          />
            <Dropdown>
              <Dropdown.Toggle variant="outline-success" className="ml-4">
                Select Type
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Bastion</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Sliver</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button className="ml-4" variant="success">
            Upload Public Key
            </Button>
        </InputGroup>
      </div>
    );
  }
}

export default Keys;