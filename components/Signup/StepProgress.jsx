const StepProgress= (props) => {
  return (
    <div className="progressbar-container">
      <ul className="progressbar">
        <li className={props.stepId >= 1 ? "active" : undefined}>Step 1</li>
        <li className={props.stepId >= 2 ? "active" : undefined}>Step 2</li>
        <li className={props.stepId === 3 ? "active" : undefined}>Step 3</li>
      </ul>
    </div>
  )
}

export default StepProgress;