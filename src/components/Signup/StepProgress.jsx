const StepProgress= (props) => {
  return (
    <div className="progressbar-container">
      <ul className="progressbar">
        <li className={props.stepId >= 1 && "active"}>Step 1</li>
        <li className={props.stepId >= 2 && "active"}>Step 2</li>
        <li className={props.stepId >= 3 && "active"}>Step 3</li>
      </ul>
    </div>
  )
}

export default StepProgress;