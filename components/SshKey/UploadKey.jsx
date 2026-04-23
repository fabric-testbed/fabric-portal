"use client";
import { useState } from "react";
import Joi from "joi";
import useForm from "@/lib/hooks/useForm";
import Textarea from "../common/Form/Textarea";
import { uploadPublicKey } from "../../services/sshKeyService";
import { setSessionItem } from "../../utils/sessionCookies";
import { default as portalData } from "../../services/portalData.json";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const schema = {
  publickey: Joi.string().required().label("Public Key"),
  description: Joi.string().required().min(5).max(255).label("Description"),
};

const publickeyTooltip = {
  id: "publicKeyTooltip",
  content: "Uploaded key must be RSA (3072 bits or longer) or ECDSA (256 bits or longer)."
};

const descriptionTooltip = {
  id: "descriptionTooltip",
  content: "Length between 5 to 255 characters."
};

export default function UploadKey({ type }) {
  const [isLoading, setIsLoading] = useState(false);

  const doSubmit = async (formData) => {
    setIsLoading(true);
    try {
      setSessionItem("sshKeyType", type);
      await uploadPublicKey(type, formData.publickey, formData.description);
      toast.success("Successfully uploaded.");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to upload public key");
      setIsLoading(false);
    }
  };

  const { data, errors, validate, handleChange, handleSubmit } = useForm(
    { publickey: "", description: "" },
    schema,
    doSubmit
  );

  return (
    <div className="w-100 mb-4">
      <h3 className="mt-4 mb-2">Upload Public {type} Key</h3>
      <div className="alert alert-primary" role="alert">
        Please follow &nbsp;
        <a
          href={portalData.learnArticles.guideToGenerateFabricCompliantKey}
          target="_blank"
          rel="noreferrer"
        >
          this guide
        </a>&nbsp;
        to generate FABRIC-compliant keys. We accept keys in OpenSSH key format.
      </div>
      <form onSubmit={handleSubmit}>
        <Textarea
          type="text"
          name="publickey"
          value={data.publickey}
          label="Public Key"
          onChange={handleChange}
          error={errors.publickey}
          tooltip={publickeyTooltip}
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
        <button disabled={validate() || isLoading} className="btn btn-primary">
          {isLoading && <Loader2 className="me-2 spin-icon" size={16} />}
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
