import React from "react";

class SelectGroup extends React.Component { 
  state = {
    baseOption: "",
    secondOption: "",
    isValid: false,
  }

  handleBaseSelectChange = (e) => {
    this.setState({ baseOption: e.target.value, secondOption: "" }, () => {
      this.setState({ isValid: this.validateTag() })
    });
  }

  handleSecondSelectChange = (e) => {
    this.setState({ secondOption: e.target.value }, () => {
      this.setState({ isValid: this.validateTag() })
    });
  }

  validateTag = () => {
    const { baseOption, secondOption } = this.state;

    // two options should be selected
    if (baseOption === "" || secondOption === "") {
      return false;
    }

    // the tag should not be duplicated
    if (this.props.tags.includes(`${baseOption}.${secondOption}`)) {
      return false;
    }

    return true;
  }

  handleClick = () => {
    const { baseOption, secondOption} = this.state;
    this.props.onTagAdd(`${baseOption}.${secondOption}`);
    this.setState({
      baseOption: "",
      secondOption: "",
      isValid: false,
    });
  }

  render() {
    const { name, baseOptions, optionsMapping } = this.props;
    const { baseOption, secondOption, isValid } = this.state;

    console.log(this.validateTag())

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
                disabled={!isValid}
                onClick={this.handleClick}
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
