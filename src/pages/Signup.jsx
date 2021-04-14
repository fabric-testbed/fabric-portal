import React from "react";
// import the progress bar
import StepProgressBar from 'react-step-progress';
// import the stylesheet
import 'react-step-progress/dist/index.css';

import Step1 from '../components/Signup/Step1';

// setup the step content
const step1Content = <Step1 />;
const step2Content = <h1>Step 2 Content</h1>;
const step3Content = <h1>Step 3 Content</h1>;
 
// setup step validators, will be called before proceeding to the next step
function step2Validator() {
  // return a boolean
}
 
function step3Validator() {
  // return a boolean
}
 
function onFormSubmit() {
  // handle the submit logic here
  // This function will be executed at the last step
  // when the submit button (next button in the previous steps) is pressed
}

const Signup = () => {
  return (
    <div className="container">
      <h1>FABRIC SignUp</h1>
      <StepProgressBar
        startingStep={0}
        onSubmit={onFormSubmit}
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
            validator: step2Validator
          },
          {
            label: 'Step 3',
            name: 'step 3',
            content: step3Content,
            validator: step3Validator
          }
        ]}
      />
      <Step1 />
    </div>
  );
};

export default Signup;
