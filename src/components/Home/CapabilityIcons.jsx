import iconEducation from "../../imgs/capabilities/education.png";
import iconInternet from "../../imgs/capabilities/internet.png";
import iconIot from "../../imgs/capabilities/iot.png";
import iconMachineLearning from "../../imgs/capabilities/machine-learning.png";
import iconSecurity from "../../imgs/capabilities/security.png";

const CapabilityIcons = () => {
  const capabilities = [
    {
      "title": "Enables New Internet and Science Applications",
      "icon": iconInternet
    },
    {
      "title": "Advances Cybersecurity",
      "icon": iconSecurity
    },
    {
      "title": "Integrates HPC, Wireless, and IoT",
      "icon": iconIot
    },
    {
      "title": "Integrates Machine Learning & Artificial Intelligence",
      "icon": iconMachineLearning
    },
    {
      "title": "Promotes Education",
      "icon": iconEducation
    }
  ]
}

export default CapabilityIcons;