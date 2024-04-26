import iconEducation from "../../imgs/capabilities/education.png";
import iconInternet from "../../imgs/capabilities/internet.png";
import iconIot from "../../imgs/capabilities/iot.png";
import iconMachineLearning from "../../imgs/capabilities/machine-learning.png";
import iconSecurity from "../../imgs/capabilities/security.png";
import { default as portalData } from "../../services/portalData.json";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react'

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

  const [tabIndex, setTabIndex] = useState(0)
  const indexRef = useRef(tabIndex)
  indexRef.current = tabIndex

  const handleChangeTab = newIndex => event => setTabIndex(newIndex)
  
  useEffect(() => {
      const timer = setInterval(() => setTabIndex((indexRef.current + 1) % 5), 3000)
      return () => clearInterval(timer)
  }, [tabIndex])

  return (
    <div className="mt-3 mb-5 d-flex flex-column align-items-center">
      <div className="d-flex flex-row justify-content-center align-items-center">
        {
          capabilities.map((capability, index) => {
              return (
                  <img
                    onMouseEnter={handleChangeTab(index)}
                    onClick={handleChangeTab(index)}
                    src={capability.icon}
                    key={`fabric-icon-${index}`}
                    height="40"
                    alt={`fabric-icon-${index}`}
                    className={index === tabIndex ? "homepage-icon-active" : "homepage-icon"}
                  />
              )
            }
          )
        }
      </div>
      <div className="d-flex justify-content-center">
      {
          capabilities.map((capability, index) => {
              return (
                <div
                  className={
                    index === tabIndex ? 
                    "homepage-icon-heading-active" : 
                    "homepage-icon-heading"}
                  key={`capability-icon-${index}`}
                >
                  {capability.title} 
                </div>
              )
            }
          )
        }
      </div>
      <div className="fabric-capability-button">
        <Link to="/about/about-fabric">
          <button className="btn homepage-icon-btn">
            <i className="fa fa-sign-in mr-2"></i><b>About FABRIC</b>
          </button>
        </Link>
        <a href={portalData.knowledgeBaseLink} target="_blank" rel="noopener noreferrer">
          <button className="btn homepage-icon-btn">
            <i className="fa fa-sign-in mr-2"></i><b>Knowledge Base</b>
          </button>
        </a>
        <Link to="/community/publications">
          <button className="btn homepage-icon-btn">
            <i className="fa fa-sign-in mr-2"></i><b>Cite FABRIC</b>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CapabilityIcons;