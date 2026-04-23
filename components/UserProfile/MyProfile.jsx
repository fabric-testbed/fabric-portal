"use client";
import { useState, useEffect } from "react";
import Joi from "joi";
import { default as portalData } from "../../services/portalData.json";
import useForm from "@/lib/hooks/useForm";
import Input from "../common/Form/Input";
import Textarea from "../common/Form/Textarea";
import Select from "../common/Form/Select";
import InputCheckboxes from "../common/InputCheckboxes";
import AccountInfo from "./AccountInfo";
import OtherIdentity from "./OtherIdentity.jsx";
import { getCurrentUser, updatePeopleProfile, updatePeoplePreference } from "../../services/peopleService.js";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { HelpCircle, Loader2 } from "lucide-react";

const schema = {
  name: Joi.string().required().label("Name"),
  email: Joi.string().required().label("Preferred Email"),
  bio: Joi.string().allow("").label("Bio"),
  pronouns: Joi.string().allow("").label("Pronouns"),
  job: Joi.string().allow("").label("Job Title"),
  website: Joi.string().allow("").label("Website"),
  receive_promotional_email: Joi.string().required().label("Receive Promotional Email"),
  allOptions: Joi.array(),
  selectedOptions: Joi.array(),
};

const allOptions = [
  "show_email", "show_roles", "show_sshkeys", "show_bio",
  "show_pronouns", "show_job", "show_website", "show_other_identities"
];

const optionsDisplayMapping = {
  show_email: "Email",
  show_roles: "Roles",
  show_sshkeys: "SSH Keys",
  show_bio: "Bio",
  show_pronouns: "Pronouns",
  show_job: "Job Title",
  show_website: "Website",
  show_other_identities: "Other Identities",
};

export default function MyProfile() {
  const [user, setUser] = useState({ email: "", email_addresses: [] });
  const [otherIdentities, setOtherIdentities] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  const { data, setData, errors, handleChange, handleSubmit, handleInputBoxCheck } = useForm(
    {
      name: "",
      email: "",
      bio: "",
      pronouns: "",
      job: "",
      website: "",
      receive_promotional_email: "Yes",
      allOptions,
      selectedOptions: [],
    },
    schema,
    null
  );

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: res } = await getCurrentUser();
        const u = res.results[0];
        const profile = {
          name: u.name,
          email: u.email,
          bio: u.profile.bio,
          pronouns: u.profile.pronouns,
          job: u.profile.job,
          receive_promotional_email: u.receive_promotional_email ? "Yes" : "No",
          website: u.profile.website,
          allOptions,
          selectedOptions: Object.keys(u.profile.preferences)
            .filter(key => u.profile.preferences[key] && allOptions.includes(key))
            .concat(
              Object.keys(u.preferences).filter(key => u.preferences[key] && allOptions.includes(key))
            ),
        };
        setData(profile);
        setUser(u);
        setOtherIdentities(u.profile.other_identities);
      } catch (err) {
        toast.error("Failed to load user information. Please re-login.");
      }
    }
    loadUser();
  }, [setData]);

  const parsePreferences = () => {
    const preferenceType1 = ["show_email", "show_roles", "show_sshkeys"];
    const preferenceType2 = ["show_bio", "show_pronouns", "show_job", "show_website", "show_other_identities"];
    const preferences1 = {};
    const preferences2 = {};
    for (const option of preferenceType1) {
      preferences1[option] = data.selectedOptions.includes(option);
    }
    for (const option of preferenceType2) {
      preferences2[option] = data.selectedOptions.includes(option);
    }
    return [preferences1, preferences2];
  };

  const handleIdentityUpdate = (operation, identity) => {
    if (operation === "add") {
      setOtherIdentities(prev => [...prev, identity]);
    } else if (operation === "remove") {
      setOtherIdentities(prev =>
        prev.filter(i => JSON.stringify(i) !== JSON.stringify(identity))
      );
    }
  };

  const handleUpdateUser = async () => {
    setShowSpinner(true);
    try {
      const parsedPreferences = parsePreferences();
      await updatePeoplePreference(user.uuid, data, parsedPreferences[0]);
      await updatePeopleProfile(user.uuid, data, parsedPreferences[1], otherIdentities);
      const { data: res } = await getCurrentUser();
      const updatedUser = res.results[0];
      const profile = {
        name: updatedUser.name,
        email: updatedUser.email,
        receive_promotional_email: updatedUser.receive_promotional_email ? "Yes" : "No",
        bio: updatedUser.profile.bio,
        pronouns: updatedUser.profile.pronouns,
        job: updatedUser.profile.job,
        website: updatedUser.profile.website,
        allOptions,
        selectedOptions: Object.keys(updatedUser.profile.preferences)
          .filter(key => updatedUser.profile.preferences[key] && allOptions.includes(key))
          .concat(
            Object.keys(updatedUser.preferences).filter(key => updatedUser.preferences[key] && allOptions.includes(key))
          ),
      };
      setData(profile);
      setUser(updatedUser);
      setShowSpinner(false);
      toast.success("You've successfully updated profile.");
    } catch (err) {
      setShowSpinner(false);
      toast.error("Failed to update user profile. Please try again.");
    }
  };

  const renderTooltip = (id, content) => (
    <Tooltip id={id}>{content}</Tooltip>
  );

  return (
    <div className="col-9">
      <h1>My Profile</h1>
      <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            value={data.name}
            label="Name"
            onChange={handleChange}
            error={errors.name}
          />
          <Select
            name="email"
            value={data.email}
            label="Preferred Email"
            currentOption={user.email}
            options={user.email_addresses}
            onChange={handleChange}
            error={errors.email}
            tooltip={portalData.helperText.preferredEmailDescription}
          />
          <Textarea
            type="text"
            name="bio"
            value={data.bio}
            label="Bio"
            onChange={handleChange}
            error={errors.bio}
          />
          <Input
            type="text"
            name="pronouns"
            value={data.pronouns}
            label="Pronouns"
            onChange={handleChange}
            error={errors.pronouns}
          />
          <Input
            type="text"
            name="job"
            value={data.job}
            label="Job Title"
            onChange={handleChange}
            error={errors.job}
          />
          <Input
            type="text"
            name="website"
            value={data.website}
            label="Website"
            onChange={handleChange}
            error={errors.website}
          />
          <div className="form-group w-100">
            <label htmlFor="preferences">
              Privacy Preferences
              <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 300 }}
                overlay={renderTooltip("select-tooltip", portalData.helperText.privacyPreferencesDescription)}
              >
                <HelpCircle className="mx-2 text-secondary" size={16} />
              </OverlayTrigger>
            </label>
            <InputCheckboxes
              allOptions={data.allOptions}
              selectedOptions={data.selectedOptions}
              optionsDisplayMapping={optionsDisplayMapping}
              showSelectAll={false}
              optionDirection={"row"}
              onCheck={handleInputBoxCheck}
              key={`input-check-boxes-${data.selectedOptions.length}`}
            />
          </div>
          <Select
            name="receive_promotional_email"
            value={data.receive_promotional_email}
            label="Receive Promotional Email"
            currentOption="Yes"
            options={["Yes", "No"]}
            onChange={handleChange}
            error={errors.receive_promotional_email}
          />
        </form>
      <OtherIdentity
        other_identities={otherIdentities}
        onIdentityUpdate={handleIdentityUpdate}
      />
      <button
        className="btn btn-md btn-primary mt-3"
        onClick={handleUpdateUser}
        disabled={showSpinner}
      >
        {showSpinner && <Loader2 className="me-2 spin-icon" size={16} />}
        {showSpinner ? "Saving..." : "Save"}
      </button>
      <AccountInfo user={user} />
    </div>
  );
}
