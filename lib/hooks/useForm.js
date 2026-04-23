"use client";
import { useState, useCallback } from "react";

/**
 * useForm hook — replaces the Form base class inheritance pattern.
 *
 * @param {Object} initialData - Initial form data
 * @param {Object} schema - Joi schema object (Joi.object({...})) or plain object of Joi validators
 * @param {Function} onSubmit - Called when validation passes
 * @returns {Object} Form state and handlers
 */
export default function useForm(initialData, schema, onSubmit) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Normalize schema: if plain object, wrap in Joi.object()
  const joiSchema = schema && typeof schema.validate === "function"
    ? schema
    : null;

  const validate = useCallback(() => {
    if (!schema) return null;

    // If it's a Joi schema object with .validate()
    if (joiSchema) {
      const { error } = joiSchema.validate(data, { abortEarly: false });
      if (!error) return null;
      const errs = {};
      for (const item of error.details) {
        errs[item.path[0]] = item.message;
      }
      return errs;
    }

    // Plain object of Joi validators (legacy pattern: { name: Joi.string()... })
    // Build a temporary schema from the individual validators
    const Joi = require("joi");
    const builtSchema = Joi.object(schema);
    const { error } = builtSchema.validate(data, { abortEarly: false });
    if (!error) return null;
    const errs = {};
    for (const item of error.details) {
      errs[item.path[0]] = item.message;
    }
    return errs;
  }, [data, schema, joiSchema]);

  const validateProperty = useCallback((name, value) => {
    if (!schema) return null;

    const Joi = require("joi");
    const fieldSchema = joiSchema
      ? null // Can't easily extract single field from compiled schema
      : schema[name];

    if (!fieldSchema) return null;

    const obj = { [name]: value };
    const singleSchema = Joi.object({ [name]: fieldSchema });
    const { error } = singleSchema.validate(obj);
    return error ? error.details[0].message : null;
  }, [schema, joiSchema]);

  const handleChange = useCallback(({ currentTarget: input }) => {
    const errorMessage = validateProperty(input.name, input.value);
    setErrors(prev => {
      const next = { ...prev };
      if (errorMessage) next[input.name] = errorMessage;
      else delete next[input.name];
      return next;
    });
    setData(prev => ({ ...prev, [input.name]: input.value }));
  }, [validateProperty]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;
    if (onSubmit) onSubmit(data);
  }, [validate, onSubmit, data]);

  const handleTagChange = useCallback((newTags) => {
    setData(prev => ({ ...prev, tags: newTags }));
  }, []);

  const handleInputBoxCheck = useCallback((option) => {
    setData(prev => {
      const selectedOptions = prev.selectedOptions.includes(option)
        ? prev.selectedOptions.filter(s => s !== option)
        : [...prev.selectedOptions, option];
      return { ...prev, selectedOptions };
    });
  }, []);

  const handleWysiwygChange = useCallback((obj) => {
    setData(prev => ({ ...prev, [obj.target.name]: obj.target.value }));
  }, []);

  const setField = useCallback((name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback((newData) => {
    setData(newData || initialData);
    setErrors({});
  }, [initialData]);

  return {
    data,
    setData,
    errors,
    setErrors,
    validate,
    handleChange,
    handleSubmit,
    handleTagChange,
    handleInputBoxCheck,
    handleWysiwygChange,
    setField,
    resetForm,
  };
}
