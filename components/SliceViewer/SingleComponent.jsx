import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import validator from  "@/lib/slices/sliceValidator";
import { default as portalData } from "../../services/portalData.json";
import { Plus, X, HelpCircle } from "lucide-react";

export default function SingleComponent({ component, onSliceComponentAdd, onSliceComponentDelete, addedComponents }) {
  const [componentTypeModel] = useState({
    "GPU": ["RTX6000", "Tesla T4", "A30", "A40"],
    "SmartNIC": ["ConnectX-6", "ConnectX-5"],
    "SharedNIC": ["ConnectX-6"],
    "FPGA": ["Xilinx-U280"],
    "NVME": ["P4510"],
    "Storage": ["NAS"]
  });
  const [modelDetails] = useState({
    "RTX6000": "NVIDIA Corporation TU102GL [Quadro RTX 6000/8000] (rev a1)",
    "Tesla T4": "NVIDIA Corporation TU104GL [Tesla T4] (rev a1)",
    "A30": "NVIDIA Corporation GA100GL [A30 PCIe] (rev a1)",
    "A40": "NVIDIA Corporation GA102GL [A40] (rev a1)",
    "ConnectX-6": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps",
    "ConnectX-5": "Mellanox ConnectX-5 Dual Port 10/25GbE",
    "P4510": "Dell Express Flash NVMe P4510 1TB SFF",
    "NAS": "Site-local NAS share",
    "Xilinx-U280": "Xilinx U280 FPGA Dual 100G port accelerator card"
  });
  const [componentType, setComponentType] = useState("");
  const [componentName, setComponentName] = useState("");
  const [componentModel, setComponentModel] = useState("");

  const handleComponentAdd = () => {
    const nodeComponent = {
      "type": componentType,
      "name": componentName,
      "model": componentModel
    };

    setComponentType("");
    setComponentName("");
    setComponentModel("");

    onSliceComponentAdd(nodeComponent);
  };

  const handleComponentDelete = () => {
    onSliceComponentDelete(component);
  };

  const handleComponentTypeChange = (e) => {
    setComponentType(e.target.value);
    setComponentModel("");
  };

  const handleComponentNameChange = (e) => {
    setComponentName(e.target.value);
  };

  const handleComponentModelChange = (e) => {
    setComponentModel(e.target.value);
  };

  const validationResult = validator.validateSingleComponent(componentType, componentName, componentModel, addedComponents);
  const renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );

  return(
    <div>
      {
        !component ?
        <div>
          <div className="form-row mx-1">
            <div className="form-group slice-builder-form-group col-md-4">
              <label htmlFor="inputComponent" className="slice-builder-label">
                Component Type
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 300 }}
                  overlay={renderTooltip("component-tooltip", portalData.helperText.componentDescription)}
                >
                  <HelpCircle className="mx-2 text-secondary" size={16} />
                </OverlayTrigger>
              </label>
              <select
                className="form-control form-control-sm"
                id="componentSelect"
                value={componentType}
                onChange={handleComponentTypeChange}
              >
                <option value="">Choose...</option>
                <option value="GPU">GPU</option>
                <option value="SmartNIC">SmartNIC</option>
                <option value="SharedNIC">SharedNIC</option>
                <option value="FPGA">FPGA</option>
                <option value="NVME">NVME</option>
                <option value="Storage">Storage</option>
              </select>
            </div>
            <div className="form-group slice-builder-form-group col-md-3">
              <label htmlFor="inputComponentName" className="slice-builder-label">Name</label>
              <input
                type="text" className="form-control form-control-sm" id="inputComponentName"
                value={componentName}
                onChange={handleComponentNameChange}
                placeholder={"at least 2 characters..."}
              />
            </div>
            <div className="form-group slice-builder-form-group col-md-4">
              <label htmlFor="inputComponent" className="slice-builder-label">Model</label>
              <select
                className="form-control form-control-sm"
                id="componentSelect"
                disabled={componentType === ""}
                value={componentModel}
                onChange={handleComponentModelChange}
              >
                <option value="">Choose...</option>
                {
                  componentType !== "" &&
                  componentTypeModel[componentType].map(model =>
                    <option value={model} key={model}>{model}</option>
                  )
                }
              </select>
            </div>
            <div className="form-group slice-builder-form-group col-md-1">
              <button
                className="btn btn-sm btn-outline-success mt-4"
                type="button"
                disabled={!validationResult.isValid}
                onClick={handleComponentAdd}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          {
            componentModel !== "" && componentModel !== "" &&
            <span className="text-sm-size mb-2 badge bg-secondary">
              {
                'Model Details: ' + modelDetails[componentModel]
              }
            </span>
          }
          {!validationResult.isValid && validationResult.message !== "" &&
            <div className="my-2 mx-1 sm-alert">
              {validationResult.message}
            </div>
          }
        </div>
        :
        <div>
          <div className="form-row mx-1">
            <div className="form-group slice-builder-form-group col-md-3">
              <select
                className="form-control form-control-sm"
                disabled
              >
                <option>{component.type}</option>
              </select>
            </div>
            <div className="form-group slice-builder-form-group col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                defaultValue={component.name}
                disabled
              />
            </div>
            <div className="form-group slice-builder-form-group col-md-4">
              <select
                className="form-control form-control-sm"
                disabled
              >
                <option>{component.model}</option>
              </select>
            </div>
            <div className="form-group slice-builder-form-group col-md-1">
              <button
                className="btn btn-sm btn-outline-danger"
                type="button"
                onClick={handleComponentDelete}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}