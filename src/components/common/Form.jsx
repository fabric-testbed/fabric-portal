import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input.jsx";
import Textarea from "./Textarea.jsx";
import Select from "./Select.jsx";
import InputTag from "./InputTag.jsx";
import TimePicker from "./TimePicker.jsx";
import ProjectTags from "../Project/ProjectTags";

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

  renderSelect(name, label, notDisabled, currentOptionName, options) {
    const { data, errors } = this.state;

    return (
        <Select
          name={name}
          value={data[name]} 
          label={label}
          currentOptionName={currentOptionName}
          options={options}
          onChange={this.handleChange}
          error={errors[name]}
          disabled={!notDisabled}
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

}

export default Form;
