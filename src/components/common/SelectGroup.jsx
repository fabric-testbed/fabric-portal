import React from "react";

class SelectGroup extends React.Component { 
  state = {
    baseOption: "",
    secondOption: "",
  }

  handleBaseSelectChange = (e) => {
    this.setState({ baseOption: e.target.value, secondOption: "" });
  }

  handleSecondSelectChange = (e) => {
    this.setState({ secondOption: e.target.value });
  }

  checkTagExists = () => {
    const { baseOption, secondOption } = this.state;

    return this.props.tags.include(`${baseOption}.${secondOption}`);
  }

  render() {
    const { name, baseOptions, optionsMapping } = this.props;
    const { baseOption, secondOption } = this.state;

    return (
      <div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-3">
              <select
                id={`base-select-${name}`}
                className="form-control form-control-sm"
                value={baseOption}
                onChange={this.handleBaseSelectChange}
              >
                <option value="">Choose...</option>
                {
                  baseOptions.map(option => <option key={option} value={option}>
                    {option}
                  </option>)
                }
              </select>
            </div>
            <div className="form-group col-md-3">
            <select 
              id={`second-select-${name}`}
              className="form-control form-control-sm"
              disabled={baseOption === ""}
              value={secondOption}
              onChange={this.handleSecondSelectChange}
            >
              <option value="">Choose...</option>
              {
                baseOption !== "" && optionsMapping[baseOption].map(option => <option key={option} value={option}>
                  {option}
                </option>)
              }
            </select>
            </div>
            <div className="form-group col-md-1">
              <button
                className="btn btn-sm btn-success"
                type="button"
                disabled={secondOption === "" || this.checkTagExists}
                onClick={() => this.props.onTagAdd(`${baseOption}.${secondOption}`)}
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SelectGroup;
