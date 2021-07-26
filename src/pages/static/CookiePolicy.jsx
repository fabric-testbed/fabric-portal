import React from "react";
import { NavLink } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="container">
      <h1 className="mb-4">FABRIC Portal Cookie Policy</h1>
      <h3 className="mt-4 text-success">
        <i className="fa fa-info-circle"></i> Cookie details
      </h3>
      <p>
        We use cookies to allow our experimenters to provision resources in the <a href="https://whatisfabric.net" target="_blank" rel="noopener noreferrer">FABRIC testbed</a> via the FABRIC Portal (‘Portal’). This policy is intended to inform you about what cookies are; what the cookies we use are for and to help you understand your choices.
      </p>

      <h3 className="mt-4 text-success">
        <i className="fa fa-info-circle"></i> What is a cookie?
      </h3>
      <p>
        A cookie is a small text file which is sent from our Portal server, and placed on your computer (laptop, mobile device etc.) when you browse the Portal.  They hold only a modest amount of data, and allow the server to recognise your computer's browser and respond accordingly.
      </p>
      <p>
        You can find more information about cookies at <a href="http://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a> and <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">www.youronlinechoices.eu</a>.
      </p>

      <h3 className="mt-4 text-success">
        <i className="fa fa-info-circle"></i> Consent to allow cookies
      </h3>
      <p>
        We are required to identify users requesting our testbed resources, thus the use of the Portal requires cookies to be enabled. Disabling cookies will disallow your use of the Portal.
      </p>

      <h3 className="mt-4 text-success">
        <i className="fa fa-info-circle"></i> What cookies do we use?
      </h3>
      <p>
        We set First Party cookies. Only the Portal and the associated FABRIC System Services can set or read them.
      </p>
      <p>
        <ul>
          <li>
            We use a persistent cookie (which stays on your device for a set period of time or until you delete it) to keep track of your consent to the cookie policy.
          </li>
          <li>
            We use session cookies (which expire once you close your web browser) to provide you with services while you are logged to the Portal via <a href="https://cilogon.org" target="_blank" rel="noopener noreferrer">CI Logon</a> and using the Portal to create your experiments. See the <a href="https://www.cilogon.org/privacy" target="_blank" rel="noopener noreferrer">CILogon Privacy Policy</a> for details of how CILogon manages your information.
          </li>
          <li>
            We do not use tracking, web analytics or any other third-party cookies
          </li>
        </ul>
      </p>

      <h3 className="mt-4 text-success">
        <i className="fa fa-info-circle"></i> Which information do we share?
      </h3>
      <p>
        We collect and report aggregate statistics about FABRIC facility use based on identity attributes of our users made available to us by their respective institutional identity providers via CI Logon. These attributes include the institution they belong to and whether they are staff, faculty or students. For more information, see the more detailed <NavLink to="/privacy-policy">privacy policy</NavLink>.
      </p>
    </div>
  );
};

export default CookiePolicy;