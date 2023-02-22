import React from "react";
import styled from 'styled-components';

const Progress = styled.div`
  position:relative;
  height: 1rem;
  font-size: .75rem;
  background-color: #e9ecef;
  border-radius: .25rem;
  width:100%;
`

const Bar = styled.div`
  background-color: ${ props => `${props.color}` };
  width: ${ props => `${props.now}%` };
  height: 1rem;
  border-radius: .25rem;
  transition:width 150ms;
`

const PercentLabel = styled.div`
  position:absolute;
  display:inline-block;
  left:50%;
  transform:translateX(-50%);
  top: .05em;
  color: ${ props => `${props.labelColor}` };
  font-weight: 600;
`

const ProgressBar = ({ label, now, color, labelColor, ...rest }) => {
  return (
    <Progress>
        <Bar now={now} color={color} />
        <PercentLabel labelColor={labelColor}>{label}</PercentLabel>
    </Progress>
  );
};

export default ProgressBar;
