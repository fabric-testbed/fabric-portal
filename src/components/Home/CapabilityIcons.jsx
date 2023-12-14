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

  return (
    <div className="mb-5 d-flex flex-column align-items-center">
      <div className="d-flex flex-row justify-content-center">
        {
          capabilities.map((capability, index) => {
              return (
                <img
                  src={capability.icon}
                  key={`fabric-icon-${index}`}
                  height="40"
                  alt={`fabric-icon-${index}`}
                  className="homepage-icon"
                />
              )
            }
          )
        }
      </div>
      <div className="w-50 d-flex flex-row justify-content-between mt-4">
        <button className="btn btn-warning">
          MORE ABOUT FABRIC
        </button>
        <button className="btn btn-warning">
          MORE ABOUT FAB
        </button>
      </div>
    </div>
  )
}

export default CapabilityIcons;