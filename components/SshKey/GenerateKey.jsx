"use client";
import { useState } from "react";
import Joi from "joi";
import useForm from "@/lib/hooks/useForm";
import { setSessionItem } from "../../utils/sessionCookies";
import Input from "../common/Form/Input";
import Textarea from "../common/Form/Textarea";
import KeyModal from "./KeyModal";
import SpinnerWithText from "../common/SpinnerWithText";
import { generateKeyPairs } from "../../services/sshKeyService";
import { toast } from "react-toastify";

const schema = {
  name: Joi.string().regex(/^\S+$/).required().min(5).max(100).label("Name"),
  description: Joi.string().required().min(5).max(255).label("Description"),
};

const nameTooltip = {
  id: "nameTooltip",
  content: "A single word without whitespace; length between 5 to 100 characters."
};

const descriptionTooltip = {
  id: "descriptionTooltip",
  content: "Length between 5 to 255 characters."
};

export default function GenerateKey({ type }) {
  const [generatedKey, setGeneratedKey] = useState({});
  const [showKeySpinner, setShowKeySpinner] = useState(false);

  const doSubmit = async (formData) => {
    setShowKeySpinner(true);
    try {
      setSessionItem("sshKeyType", type);
      const { data: res } = await generateKeyPairs(type, formData.name, formData.description, true);
      setGeneratedKey(res.results[0]);
      setShowKeySpinner(false);
    } catch (err) {
      setShowKeySpinner(false);
      toast.error("Failed to generate ssh key pairs.");
    }
  };

  const { data, errors, validate, handleChange, handleSubmit } = useForm(
    { name: "", description: "" },
    schema,
    doSubmit
  );

  return (
    <div className="w-100">
      <h3 className="my-2">Generate {type} Key Pair</h3>
      {showKeySpinner && <SpinnerWithText text={"Generating Keys..."} />}
      <KeyModal data={generatedKey} name={data.name} />
      {!showKeySpinner && (
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            value={data.name}
            label="Name"
            onChange={handleChange}
            error={errors.name}
            tooltip={nameTooltip}
          />
          <Textarea
            type="text"
            name="description"
            value={data.description}
            label="Description"
            onChange={handleChange}
            error={errors.description}
            tooltip={descriptionTooltip}
          />
          <button disabled={validate()} className="btn btn-primary">
            Generate
          </button>
        </form>
      )}
    </div>
  );
}
