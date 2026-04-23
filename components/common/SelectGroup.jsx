import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";

function SelectGroup({ name, tags, baseOptions, optionsMapping, onTagAdd }) {
  const [baseOption, setBaseOption] = useState("");
  const [secondOption, setSecondOption] = useState("");

  const isValid = useCallback(() => {
    if (baseOption === "" || secondOption === "") return false;
    if (tags.includes(`${baseOption}.${secondOption}`)) return false;
    return true;
  }, [baseOption, secondOption, tags]);

  const handleBaseSelectChange = (e) => {
    setBaseOption(e.target.value);
    setSecondOption("");
  };

  const handleSecondSelectChange = (e) => {
    setSecondOption(e.target.value);
  };

  const handleClick = () => {
    onTagAdd(`${baseOption}.${secondOption}`);
    setBaseOption("");
    setSecondOption("");
  };

  return (
    <div>
      <form>
        <div className="form-row">
          <div className="form-group col-md-3">
            <select
              id={`base-select-${name}`}
              className="form-control form-control-sm"
              value={baseOption}
              onChange={handleBaseSelectChange}
            >
              <option value="">Choose...</option>
              {baseOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3">
            <select
              id={`second-select-${name}`}
              className="form-control form-control-sm"
              disabled={baseOption === ""}
              value={secondOption}
              onChange={handleSecondSelectChange}
            >
              <option value="">Choose...</option>
              {baseOption !== "" && optionsMapping[baseOption].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              disabled={!isValid()}
              onClick={handleClick}
            >
              <Plus size={16} className="me-2" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SelectGroup;
