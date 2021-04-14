import React from "react";
// import the progress bar
import StepProgressBar from 'react-step-progress';
// import the stylesheet
import 'react-step-progress/dist/index.css';

import Step1 from '../components/Signup/Step1';
import Step2 from '../components/Signup/Step2';
import Step3 from '../components/Signup/Step3';

// setup the step content
const step1Content = <Step1 />;
const step2Content = <Step2 />;
const step3Content = <Step3 />;

const Signup = () => {
  return (
    <div className="container">
      <h1>FABRIC SignUp</h1>
      <StepProgressBar
        startingStep={0}
        steps={[
          {
            label: 'Step 1',
            name: 'step 1',
            content: step1Content
          },
          {
            label: 'Step 2',
            name: 'step 2',
            content: step2Content,
          },
          {
            label: 'Step 3',
            name: 'step 3',
            content: step3Content,
          }
        ]}
      />
    </div>
  );
};

export default Signup;
