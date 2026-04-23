import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getFundingAgencies, getFundingDirectorates } from "../../../services/projectService";
import { toast } from "react-toastify";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Funding = ({ fundings, canUpdate, onFundingUpdate }) => {
  const [agency_options, setAgencyOptions] = useState([]);
  const [directorate_options, setDirectorateOptions] = useState([]);
  const [agency, setAgency] = useState("");
  const [directorate, setDirectorate] = useState("");
  const [award_number, setAwardNumber] = useState("");
  const [award_amount, setAwardAmount] = useState("");
  const [agency_other, setAgencyOther] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { data: res1 } = await getFundingAgencies();
        const { data: res2 } = await getFundingDirectorates();
        setAgencyOptions(res1.results);
        setDirectorateOptions(res2.results);
      } catch (err) {
        toast.error("Failed to load funding agency and directorate options. Please reload this page.");
      }
    };
    loadOptions();
  }, []);

  const handleFundingAdd = () => {
    const newFunding = {
      "agency": agency,
      "directorate": directorate,
      "award_number": award_number,
      "award_amount": award_amount,
      "agency_other": agency_other
    };
    onFundingUpdate("add", newFunding);
    setAgency("");
    setDirectorate("");
    setAwardNumber("");
    setAwardAmount("");
    setAgencyOther("");
  };

  const parseFundingStr = (funding) => {
    if (funding.agency === "Other") {
      return `${funding.agency_other} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else if (funding.agency === "NSF") {
      return `${funding.agency} ${funding.directorate ? `| ${funding.directorate}` : ""} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    } else {
      return `${funding.agency} ${funding.award_number ? `| ${funding.award_number}` : ""} ${funding.award_amount ? `| ${funding.award_amount}` : ""}`;
    }
  };

  return (
    <div className="mt-2 mb-3">
      <h5>Funding Information</h5>
      <Form>
      {
        canUpdate &&
        <Row>
          <Col xs={2}>
            <Form.Group controlId="fundingAgencySelect">
              <Form.Label>Agency*</Form.Label>
              <Form.Select
                className="form-control form-control-sm"
                id="fundingAgencySelect"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
              >
                <option value="">Choose...</option>
                {
                  agency_options.map((agencyOption, index) =>
                    <option value={agencyOption} key={`funding-agency-${index}`}>{agencyOption}</option>
                  )
                }
              </Form.Select>
            </Form.Group>
          </Col>
          {
            agency === "NSF" &&
            <Col xs={3}>
              <Form.Group controlId="fundingAgencySelect">
                <Form.Label>NSF Directorate</Form.Label>
                <Form.Select
                  className="form-control form-control-sm"
                  id="directorateSelect"
                  value={directorate}
                  onChange={(e) => setDirectorate(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {
                    directorate_options.map((directorateOption, index) =>
                      <option value={directorateOption} key={`funding-directorate-${index}`}>{directorateOption}</option>
                    )
                  }
                </Form.Select>
              </Form.Group>
            </Col>
          }
          {
            agency === "Other" &&
            <Col xs={3}>
              <Form.Group controlId="fundingAgencySelect">
                <Form.Label>Agency Name</Form.Label>
                <Form.Control
                  type="text"
                  value={agency_other}
                  onChange={(e) => setAgencyOther(e.target.value)}
                />
              </Form.Group>
            </Col>
          }
          <Col xs={3}>
            <Form.Group controlId="fundingAgencySelect">
              <Form.Label>Award Number</Form.Label>
              <Form.Control
                type="text"
                value={award_number}
                onChange={(e) => setAwardNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={3}>
            <Form.Group controlId="fundingAgencySelect">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                value={award_amount}
                onChange={(e) => setAwardAmount(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={1} className="d-flex align-items-end">
            <Button
              variant="outline-success"
              type="button"
              onClick={handleFundingAdd}
            >
              Add
            </Button>
          </Col>
        </Row>
      }
      </Form>
      <div className="mt-2">
          <ul className="input-tag__tags">
            {
              fundings.length > 0 &&
              fundings.map((funding, index) =>
              <li
                key={`funding-to-add-${index}`}
                className="me-2"
              >
                { parseFundingStr(funding) }
                {
                  canUpdate && <X size={14} className="ms-2 cursor-pointer" onClick={() => onFundingUpdate("remove", funding)} />
                }
            </li>)
            }
          </ul>
      </div>
      {
        fundings.length === 0 && !canUpdate &&
        <div
          className="alert alert-primary mb-2"
          role="alert"
        >
          This project has no funding added yet.
        </div>
      }
    </div>
  );
};

export default Funding;
