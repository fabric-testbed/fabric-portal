import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input.jsx";
import Textarea from "./Textarea.jsx";
import Select from "./Select.jsx";
import InputTag from "./InputTag.jsx";
import TimePicker from "./TimePicker.jsx";
import Switch from "./Switch.jsx";
import ProjectTags from "../../Project/ProjectTags";
import InputCheckboxes from "../InputCheckboxes.jsx";
import Wysiwyg from "./Wysiwyg.jsx";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Parser from 'html-react-parser';

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};

    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    // Prevent page reload.
    e.preventDefault();

    const errors = this.validate();

    console.log(errors);

    // errors should never be null.
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    // validation.
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleTagChange = (newTags) => {
    const data = { ...this.state.data };
    data.tags = newTags;
    this.setState({ data });
  };

  handleInputBoxCheck = (option) => {
    const { data } = this.state;

    let selectedOptions = [];
    
    if (data.selectedOptions.includes(option)) {
      for (const s of data.selectedOptions) {
        if (s !== option) { selectedOptions.push(s); }
      }
    } else {
      selectedOptions = [...data.selectedOptions];
      selectedOptions.push(option);
    }

    const updatedData = { ...data };
    updatedData.selectedOptions = selectedOptions;
    this.setState({ data: updatedData})
  }

  handleWysiwygChange = (Obj) => {
    const data = { ...this.state.data };
    data[Obj.target.name] = Obj.target.value;
    this.setState({ data });
  }

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(name, label, notDisabled, tooltip, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        disabled={!notDisabled}
        tooltip={tooltip}
      />
    );
  }

  renderWysiwyg(name, label, notDisabled) {
    const { data, errors } = this.state;
    if (notDisabled) {
      return (
        <Wysiwyg
          name={name}
          content={data[name]}
          label={label}
          onChange={this.handleWysiwygChange}
          error={errors[name]}
          disabled={!notDisabled}
        />
      )
    } else {
      return (
        <div class="form-group">
        <label for="projectDescription">{label}</label>
        <div className="disabled-project-description">
          {Parser(data[name])}
        </div>
      </div>
      )
    }
  }

  renderTextarea(name, label, notDisabled, tooltip, type = "text") {
    const { data, errors } = this.state;

    return (
      <Textarea
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        disabled={!notDisabled}
        tooltip={tooltip}
      />
    );
  }

  renderInputTag(name, label) {
    const { data } = this.state;
    return (
      <InputTag
        name={name}
        tags={data.tags}
        label={label}
        onTagChange={this.handleTagChange}
      />
    );
  }

  renderProjectTags(name, label, baseOptions, optionsMapping) {
    const { data } = this.state;
    return (
      <ProjectTags
        name={name}
        label={label}
        tags={data.tags}
        baseOptions={baseOptions}
        optionsMapping={optionsMapping}
        onTagChange={this.handleTagChange}
      />
    );
  }

  renderInputCheckBoxes(name, label, notDisabled, optionsDisplayMapping, tooltip) {
    const { data } = this.state;
    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    return (
      <div className="form-group w-100">
         {
          tooltip ? <label htmlFor={name}>
            {label} 
            <OverlayTrigger
              placement="right"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("select-tooltip", tooltip)}
            >
              <i className="fa fa-question-circle text-secondary ml-2"></i>
            </OverlayTrigger>
          </label> :
          <label htmlFor={name}>{label}</label>
        }
        <InputCheckboxes
          allOptions={data.allOptions}
          selectedOptions={data.selectedOptions}
          optionsDisplayMapping={optionsDisplayMapping}
          showSelectAll={false}
          optionDirection={"row"}
          onCheck={this.handleInputBoxCheck}
          key={`input-check-boxes-${data.selectedOptions.length}`}
          disabled={!notDisabled}
          tooltip={tooltip}
        />
      </div>
    )
  }


  renderSelect(name, label, notDisabled, currentOption, options, tooltip) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]} 
        label={label}
        currentOption={currentOption}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
        disabled={!notDisabled}
        tooltip={tooltip}
      />
    );
  }

  renderTimePicker(name, label) {
    const { data, errors } = this.state;

    return (
      <TimePicker
        name={name}
        label={label}
        onChange={this.handleChange}
      />
    );
  }

  renderSwitch(name, label, notDisabled, tooltip) {
    const { data, errors } = this.state;

    return (
      <Switch
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        disabled={!notDisabled}
        tooltip={tooltip}
      />
    );
  }
}

export default Form;
