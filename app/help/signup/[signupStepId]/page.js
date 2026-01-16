import React from "react";
import StepProgress from '../../../../components/Signup/StepProgress';
import Step1 from '../../../../components/Signup/Step1';
import Step2 from '../../../../components/Signup/Step2';
import Step3 from '../../../../components/Signup/Step3';
import DenyEnrollment from '../../../../components/Signup/DenyEnrollment';

export default async function Signup({params}){
    const { signupStepId } = await params;
    const stepId = parseInt(signupStepId);
  return (
    <div className="container">
      <img src="/imgs/network-bg.svg" alt={`static page background`} className="static-page-bg"/>
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

