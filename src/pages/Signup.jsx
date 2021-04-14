import React from "react";
import {
  useParams
} from "react-router-dom";

// import the progress bar
import StepProgressBar from 'react-step-progress';
// import the stylesheet
import 'react-step-progress/dist/index.css';

import StepProgress from '../components/Signup/StepProgress';
import Step1 from '../components/Signup/Step1';
import Step2 from '../components/Signup/Step2';
import Step3 from '../components/Signup/Step3';

// setup the step content
const step1Content = <Step1 />;
const step2Content = <Step2 />;
const step3Content = <Step3 />;

const Signup = () => {
  let { id } = useParams();
  return (
    <div className="container">
      <h1>FABRIC SignUp</h1>
      <StepProgress stepId={id} />
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
  );
};

export default Signup;
