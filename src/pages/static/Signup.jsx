import React from "react";
import {
  useParams
} from "react-router-dom";

import StepProgress from '../../components/Signup/StepProgress';
import Step1 from '../../components/Signup/Step1';
import Step2 from '../../components/Signup/Step2';
import Step3 from '../../components/Signup/Step3';
import DenyEnrollment from '../../components/Signup/DenyEnrollment';

const Signup = () => {
  let { id } = useParams();
  let stepId = parseInt(id)
  return (
    <div className="container">
      <h2 className="text-center">FABRIC SignUp</h2>
      {
        stepId !== 4 && <StepProgress stepId={stepId} />
      }
      <div>
        {
          stepId === 1 && <Step1 />
        }
        {
          stepId === 2 && <Step2 />
        }
        {
          stepId === 3 && <Step3 />
        }
        {
          stepId === 4 && <DenyEnrollment />
        }
      </div>
    </div>
  );
};

export default Signup;
