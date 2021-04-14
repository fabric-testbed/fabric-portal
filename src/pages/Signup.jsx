import React from "react";
import {
  useParams
} from "react-router-dom";

import StepProgress from '../components/Signup/StepProgress';
import Step1 from '../components/Signup/Step1';
import Step2 from '../components/Signup/Step2';
import Step3 from '../components/Signup/Step3';

const Signup = () => {
  let { id } = useParams();
  return (
    <div className="container">
      <h2 className="text-center">FABRIC SignUp</h2>
      <StepProgress stepId={id} />
      <div>
        {
          id == 1 && <Step1 />
        }
        {
          id == 2 && <Step2 />
        }
        {
          id == 3 && <Step3 />
        }
      </div>
    </div>
  );
};

export default Signup;
