import React, { useState, useEffect } from 'react'
import SingleComponent from './SingleComponent';
import validator from  "@/lib/slices/sliceValidator";
import { Info, ChevronUp, ChevronDown } from "lucide-react";

export default function SliceEditorDetailForm({ data, nodes, links, selectedCPs, onVMUpdate, onNodeDelete, onConnectionPointSelect, onSingleComponentAdd, onJsonUpload }) {
  const [nodeName, setNodeName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [core, setCore] = useState(0);
  const [isCoreChanged, setIsCoreChanged] = useState(false);
  const [ram, setRam] = useState(0);
  const [isRamChanged, setIsRamChanged] = useState(false);
  const [disk, setDisk] = useState(0);
  const [isDiskChanged, setIsDiskChanged] = useState(false);
  const [BootScript, setBootScript] = useState("");
  const [isBootScriptChanged, setIsBootScriptChanged] = useState(false);
  const [showVMComponent, setShowVMComponent] = useState(false);
  const [validationResult, setValidationResult] = useState({
    isValid: true,
    message: ""
  });

  useEffect(() => {
    setNodeName("");
    setIsNameChanged(false);
    setCore(0);
    setIsCoreChanged(false);
    setRam(0);
    setIsRamChanged(false);
    setDisk(0);
    setIsDiskChanged(false);
    setShowVMComponent(false);
    setValidationResult({
      isValid: true,
      message: ""
    });
  }, [data?.properties?.id]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const result = validator.validateDetailForm("name", name, data.id, nodes);
    setNodeName(name);
    setValidationResult(result);
    setIsNameChanged(true);
  }

  const handleCoreChange = (e) => {
    const val = Number(e.target.value);
    const result = validator.validateDetailForm("capacity", val);
    setCore(val);
    setValidationResult(result);
    setIsCoreChanged(true);
  }

  const handleRamChange = (e) => {
    const val = Number(e.target.value);
    const result = validator.validateDetailForm("capacity", val);
    setRam(val);
    setValidationResult(result);
    setIsRamChanged(true);
  }

  const handleDiskChange = (e) => {
    const val = Number(e.target.value);
    const result = validator.validateDetailForm("capacity", val);
    setDisk(val);
    setValidationResult(result);
    setIsDiskChanged(true);
  }

  const handleBootScriptChange = (e) => {
    const val = e.target.value;
    setBootScript(val);
    setIsBootScriptChanged(true);
  }

  const handleShowVMComponent = () => {
    setShowVMComponent(!showVMComponent);
  }

  const handleVMUpdate = (e) => {
    e.preventDefault();
    const newName = isNameChanged ? nodeName : data.properties.name;
    const newCore = isCoreChanged ? core : JSON.parse(data.capacities).core;
    const newRam = isRamChanged ? ram : JSON.parse(data.capacities).ram;
    const newDisk = isDiskChanged ? disk : JSON.parse(data.capacities).disk;
    const newBootScript = isBootScriptChanged ? BootScript : data.BootScript;
    const capacities = JSON.stringify({"core": newCore, "ram": newRam, "disk": newDisk});
    onVMUpdate({ vm_id: data.id, new_name: newName, new_capacities: capacities, new_boot_script: newBootScript });
  }

  const isCPAvailable = () => {
    const cp_id = parseInt(data.id);
    for (const link of links) {
      if (link.source === cp_id) {
        return false;
      }
    }

    if (selectedCPs.length === 0) {
      return true;
    }

    for (const cp of selectedCPs) {
      if (cp_id === parseInt(cp.id)) {
        return false;
      }
    }

    return true;
  }

  const handleSelect = () => {
    onConnectionPointSelect(data);
  }

  const handleNodeDelete = () => {
    onNodeDelete(data);
  }

  const handleSingleComponentAdd = (componentData) => {
    onSingleComponentAdd(componentData);
  }

  const handleFileDrop = (textStr) => {
    onJsonUpload(textStr);
  }

  const getVMComponents = () => {
    const vm_component_ids = [];

    for (const link of links) {
      if (link.Class === "has" && link.source === parseInt(data.id)) {
        vm_component_ids.push(link.target);
      }
    }

    const vm_components = [];

    if (vm_component_ids && vm_component_ids.length > 0) {
      for (const compo_id of vm_component_ids) {
        const node = nodes.filter(node => node.id === compo_id)[0];
        const vm_component = {
          "type": node.Type,
          "name": node.Name,
          "model": node.Model
        };
        vm_components.push(vm_component);
      }
    }

    return vm_components;
  }

  let componentKey = "";
  if (data && data.properties) {
    componentKey = `${data.properties.id}-${data.properties.name}`
  }

  return (
    <div className="new-slice-detail-form" key={componentKey}>
      <form>
          {
            (!data || !data.properties) && (
              <div className="my-3">
                  <span>
                    <Info className="mx-2" size={16} />
                    Click an element on the topology to make changes.
                  </span>
              </div>
            )
          }

          {
            data && data.properties && data.properties.class === "CompositeNode" &&
            <div className="form-row px-3">
              <div className="col mb-2">
                <label className="slice-builder-label">Site Name</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
              </div>
            </div>
          }
          {
            data && data.properties && data.properties.type === "Facility" &&
            <div className="form-row px-3">
              <div className="col-11 mb-2">
                <label className="slice-builder-label">Facility Name</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
              </div>
              <div className="col-1 pt-4 pb-2 d-flex flex-row">
                <button
                  className="btn btn-sm btn-danger w-100"
                  type="button"
                  onClick={handleNodeDelete}
                >
                  Delete
                </button>
              </div>
              {
                !validationResult.isValid && validationResult.message !== "" &&
                <div className="mb-1 sm-alert mx-3">
                  {validationResult.message}
                </div>
              }
            </div>
          }
          {
            data && data.properties && data.properties.type === "VM" &&
            <div>
              <div className="form-row px-3">
                <div className="col-3 mb-2">
                  <label className="slice-builder-label">VM Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} onChange={handleNameChange}/>
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Cores</label>
                  <input type="number" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).core} onChange={handleCoreChange}/>
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">RAM(GB)</label>
                  <input type="number" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).ram} onChange={handleRamChange}/>
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Disk(GB)</label>
                  <input type="number" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).disk} onChange={handleDiskChange}/>
                </div>
                <div className="col-1 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-success w-100"
                    type="button"
                    disabled={!validationResult.isValid}
                    onClick={handleVMUpdate}
                    >
                      Update
                  </button>
                </div>
                <div className="col-1 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-danger w-100"
                    type="button"
                    onClick={handleNodeDelete}
                  >
                    Delete
                  </button>
                </div>
                <div className="col-1 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-primary w-100"
                    type="button"
                    onClick={handleShowVMComponent}
                    >
                      {showVMComponent ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
              {!validationResult.isValid && validationResult.message !== "" &&
                <div className="mb-1 sm-alert mx-3">
                  {validationResult.message}
                </div>
              }
              {
                showVMComponent &&
                <div className="form-row px-3">
                   <div className="col-12">
                    <label htmlFor="BootScript" className="slice-builder-label">Boot Script (optional)</label>
                    <textarea
                      className="form-control"
                      id="BootScript"
                      rows="1"
                      defaultValue={data.BootScript}
                      onChange={handleBootScriptChange}
                    />
                   </div>
                   <div className="col-12">
                    <SingleComponent
                      addedComponents={getVMComponents()}
                      onSliceComponentAdd={handleSingleComponentAdd}
                    />
                   </div>
                </div>
              }
            </div>
          }

          {
            data && data.properties && data.properties.class === "Component" &&
              <div className="form-row px-3">
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Component Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Type</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Model</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.model} disabled/>
                </div>
                <div className="col-5 mb-2">
                  <label className="slice-builder-label">Detail</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.detail} disabled/>
                </div>
                <div className="col-1 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-danger ms-auto"
                    type="button"
                    onClick={handleNodeDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
          }

          {
            data && data.properties && data.properties.class === "ConnectionPoint" &&
            <div className="form-row px-3">
              <div className="col-5 mb-2">
                <label className="slice-builder-label">Connection Point Name</label>
                <input type="text" className="form-control form-control-sm" defaultValue={ data.properties.name} disabled/>
              </div>
              <div className="col-5 mb-2">
                <label className="slice-builder-label">Type</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
              </div>
              <div className="col-2 pt-4 pb-2 d-flex flex-row">
                {
                  data.properties.type !== "ServicePort" && isCPAvailable() &&
                  <button
                    className="btn btn-sm btn-success ms-auto"
                    type="button"
                    onClick={handleSelect}
                  >
                    Select
                  </button>
                }
                 {
                  data.properties.type === "ServicePort" &&
                  <button
                    className="btn btn-sm btn-danger ms-auto"
                    type="button"
                    onClick={handleNodeDelete}
                  >
                    Delete
                  </button>
                }
              </div>
            </div>
          }
          {
            data && data.properties &&
            data.properties.class === "NetworkService" &&
            data.properties.type !== "VLAN" &&
            <div className="form-row px-3">
              <div className="col-5 mb-2">
                <label className="slice-builder-label">Network Service Name</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
              </div>
              <div className="col-5 mb-2">
                <label className="slice-builder-label">Type</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
              </div>
              <div className="col-2 pt-4 pb-2 d-flex flex-row">
                <button
                  className="btn btn-sm btn-danger ms-auto"
                  type="button"
                  onClick={handleNodeDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          }
          {
            data && data.properties && data.properties.type === "VLAN" &&
            <div className="form-row px-3">
              <div className="col-6 mb-2">
                <label className="slice-builder-label">VLAN Name</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
              </div>
              <div className="col-6 mb-2">
                <label className="slice-builder-label">Type</label>
                <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
              </div>
            </div>
          }
      </form>
    </div>
    );
}
